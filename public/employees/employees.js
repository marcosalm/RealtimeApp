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
 *   employees.js
 *
 * DESCRIPTION
 *   The employees module for the AngularJS application.
 *
 *****************************************************************************/


angular.module('realtimeOracle.employees', [])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('employees', {
            url: '/employees?message',
            params: {
                message: {
                    value: null
                }
            },
            views: {
                "main": {
                    controller: 'employeesCtrl as employeesCtrl',
                    templateUrl: 'employees/employees.tpl.html'
                }
            },
            data:{pageTitle: 'Employees'},
            resolve: {
                employees: [
                    '$http',
                    function($http) {
                        return $http.get('/api/employees')
                            .then(function(res) {
                                return res.data.rows;
                            });
                    }
                ]
            },
            onEnter: ['socket', function(socket) {
                socket.emit('startListening', {
                    name: 'employees'
                });
            }],
            onExit: ['socket', function(socket) {
                socket.emit('stopListening', {
                    name: 'employees'
                });
            }]
        });
    }])

    .controller('employeesCtrl', [
        '$scope',
        '$state',
        'socket',
        'employees',
        function($scope, $state, socket, employees) {
            var employeesCtrl = this;

            employeesCtrl.employees = employees;
            employeesCtrl.message = $state.params.message;

            socket.on('change', function(employees) {
                employeesCtrl.employees = employees;

                $scope.$apply();
            });
        }
    ])

;