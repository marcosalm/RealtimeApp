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
 *   database.js
 *
 * DESCRIPTION
 *   Contains logic related to working with the database.
 *
 *****************************************************************************/

var oracledb = require('oracledb');
var pool;

function connect(config, callback) {
    oracledb.createPool(
        config,
        function(err, p) {
            if (err) throw err;

            pool = p;

            callback();
        }
    );
}

function disconnect(callback) {
    if (pool) {
        pool.terminate(function(err) {
            if (err) {
                console.error('Error terminating pool', err.message);
            } else {
                console.log('Terminated connection pool' + key);
            }

            callback();
        });
    } else {
        console.log('No database connection pool to terminate');

        callback();
    }
}

function getPool() {
    return pool;
}

module.exports.connect = connect;
module.exports.disconnect = disconnect;
module.exports.getPool = getPool;