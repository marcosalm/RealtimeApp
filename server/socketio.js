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
 *   socketio.js
 *
 * DESCRIPTION
 *   Contains the logic related to Socket.IO.
 *
 *****************************************************************************/

var http = require('http');
var socketio = require('socket.io');
var io;

function listen(httpServer) {
    io = socketio(httpServer);

    io.on('connection', function(socket){
        handleStartListening(socket);
        handleStopListening(socket);
    });
}

module.exports.listen = listen;

function handleStartListening(socket) {
    socket.on('startListening', function(room) {
        socket.join(room.name);
    });
}

function handleStopListening(socket) {
    socket.on('stopListening', function(room) {
        socket.leave(room.name);
    });
}

function handleDatabaseCallback(req, res) {
    var options = {
        host: 'localhost',
        port: 3000,
        path: '/api/employees'
    };

    http.get(options, function(resp){
        var body = '';

        resp.on('data', function(chunk){
            body += chunk.toString();
        });

        resp.on('end', function(chunk){
            var parsed = JSON.parse(body);

            console.log(parsed);

            io.to('employees').emit('change', parsed.rows);

            res.send();
        });
    }).on('error', function(e){
        console.log("Got error: " + e.message);
    });
}

module.exports.handleDatabaseCallback = handleDatabaseCallback;