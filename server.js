/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   server.js
 *
 * DESCRIPTION
 *   The main entry point for the Node.js application. This sets up end points
 *   for static files, the application api, as well as the database for query
 *   result change notifications.
 *
 *****************************************************************************/

var domain = require('domain');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var dbconfig = require('./server/dbconfig.js');
var database = require('./server/database.js');
var api = require('./server/api.js');
var socketio = require('./server/socketio.js');
var app;
var httpServer;
var serverDomain = domain.create();
var openConnections = {};

serverDomain.on('error', function(err) {
    console.error('Domain error caught', err);

    shutdown();
});

serverDomain.run(initApp);

function initApp() {
    app = express();
    httpServer = http.Server(app);
    socketio.listen(httpServer);

    app.use(morgan('combined')); //logger
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/', serveStatic(__dirname + '/public'));
    app.use('/vendor', serveStatic(__dirname + '/bower_components'));

    app.use('/api', api.getRouter());

    app.get('/db', socketio.handleDatabaseCallback);

    httpServer.on('connection', function(conn) {
        var key = conn.remoteAddress + ':' + conn.reportPort;

        openConnections[key] = conn;

        conn.on('close', function() {
            delete openConnections[key];
        });
    });

    database.connect(dbconfig, function() {
        httpServer.listen(3000, function() {
            console.log('Webserver listening on localhost:3000');
        });
    });
}

function shutdown() {
    console.log('Shutting down');

    httpServer.close(function () {
        console.log('Web server closed');

        database.disconnect(function() {
            console.log('DB disconnected, exiting process');
            process.exit(0);
        });
    });

    for (key in openConnections) {
        openConnections[key].destroy();
    }
}

