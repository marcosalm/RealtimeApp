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
 *   employee-details.js
 *
 * DESCRIPTION
 *   The employee-details module for the AngularJS application.
 *
 *****************************************************************************/

angular.module('realtimeOracle.employeeDetails', [])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('employee-details', {
            url: '/employee-details/:employee_id',
            views: {
                "main": {
                    controller: 'employeeDetailsCtrl as employeeDetailsCtrl',
                    templateUrl: 'employee-details/employee-details.tpl.html'
                }
            },
            data:{pageTitle: 'Employee Details'},
            resolve: {
                employee: [
                    '$http',
                    '$stateParams',
                    function($http, $stateParams) {
                        if ($stateParams.employee_id) {
                            return $http.get('/api/employees/' + $stateParams.employee_id)
                                .then(function(res) {
                                    if (res.data.rows.length) {
                                        res.data.rows[0].HIRE_DATE = new Date(res.data.rows[0].HIRE_DATE);
                                    }
                                    return res.data.rows[0];
                                });
                        }
                    }
                ]
            }
        });
    }])

    .controller('employeeDetailsCtrl', [
        '$state',
        '$http',
        'employee',
        function($state, $http, employee) {
            this.employee = employee;
            this.mode = (employee) ? 'edit' : 'create';

            this.goToEmployees = function() {
                $state.go('employees');
            };

            this.create = function() {
                $http.post('/api/employees', this.employee)
                    .then(function() {
                        $state.go('employees', {message: 'EMPLOYEE_CREATED'});
                    });
            };

            this.save = function() {
                $http.put('/api/employees/' + this.employee.EMPLOYEE_ID, this.employee)
                    .then(function() {
                        $state.go('employees', {message: 'EMPLOYEE_SAVED'});
                    });
            };

            this.delete = function() {
                $http.delete('/api/employees/' + this.employee.EMPLOYEE_ID)
                    .then(function() {
                        $state.go('employees', {message: 'EMPLOYEE_DELETED'});
                    });
            };
        }
    ])

;