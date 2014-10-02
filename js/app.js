/**
 * Created by colinjlacy on 9/21/14.
 */

/*
Normally I would separate these items into different files, but since they're so short I thought I'd keep them together to make it easier for those looking them over
 */

angular.module("bubbleApp", [])
.controller("bubbleCtrl", function($scope, bubbleSrvc) {

		$scope.random = function() {
			bubbleSrvc.getNumbers().then(function(data) {
				$scope.numbers = data;

				// reset some data that might be out there
				if ($scope.playing) {
					$scope.stop();
					$scope.playing = false;
				}
				$scope.return = null;
				$scope.active = 0;
			});
		};

        $scope.stepSort = function() {
            // let the world know the app is working
            $scope.working = true;

            // get those numbers from the backend
            bubbleSrvc.stepSort($scope.numbers[$scope.active], $scope.numbers[$scope.active + 1]).then(function(data) {
                // the next two lines re-order the two numbers sent by the back-end accordingly
				console.log($scope.numbers[$scope.active]+", "+$scope.numbers[$scope.active + 1]+" -- "+data[0]+", "+data[1]);

                $scope.numbers[$scope.active] = data[0];
                $scope.numbers[$scope.active + 1] = data[1];

                // this line helps with styling by marking the row (and consequently the row following) that was just returned
                $scope.return = $scope.active;

                // looks like you're no longer working
                $scope.working = false;

                // did that accomplish the goal? Check with a server-side validation
                bubbleSrvc.sortCheck($scope.numbers).then(function(boolean) {
                    // set a scope values that dictates the result of the back-end validation to all the things
                    $scope.sorted = boolean;
                    // it the array is sorted, and the automated loop is running, stop the loop
                    if ($scope.sorted && $scope.playing) {
                        $scope.stop();
                    }
                });

                // if not, get ready for the next click
                if (!$scope.sorted && $scope.active < $scope.numbers.length - 2) { // checks to see where we are in the array
                    // if we're not on the second to last number, increments
                    $scope.active++;
                    // a helper to assist in styling
                    $scope.stepping = true;
                } else {
                    //
                    $scope.active = 0;
                }
            });
        };

        $scope.playSort = function() {
            // alert Angular that we are, in fact, running through the steps automatically
            $scope.playing = true;

            // set the interval
            $scope.runningTimer = setInterval(function () {
                if ($scope.working) {
                    // prevents any collisions in the AJAX call
                    return;
                }
                $scope.stepSort();
            }, 500); // happens every 500 milliseconds
        };

        $scope.stop = function() {
            // clear the interval timer
            clearInterval($scope.runningTimer);

            // alert Angular that we've stopped
            $scope.playing = false;
        }
    })
.service("bubbleSrvc", function($http, $q) {
        /*
        Each of the following is an AJAX call to allow Angular to communicate with the three back-end scripts.
         */
        return {

            // ajax call to get the random numbers array
            getNumbers: function() {
                var numbers = $q.defer();
                $http ({
                    method: 'GET',
                    url: 'server/random.php'
                }).success(function(data) {
                    numbers.resolve(data);
                }).error(function(error) {
                    numbers.reject(error);
                });
                return numbers.promise;
            },

            // ajax call to sort the two numbers
            stepSort: function(first, second) {
                var numbers = $q.defer();
                $http ({
                    method: 'POST',
                    url: 'server/sort.php',
                    data: [first, second]
                }).success(function(data) {
                    numbers.resolve(data);
                }).error(function(error) {
                    numbers.reject(error);
                });
                return numbers.promise;
            },

            // ajax call to check if the array is sorted
            sortCheck: function(array) {
                var boolean = $q.defer();
                $http ({
                    method: 'POST',
                    url: 'server/check.php',
                    data: array
                }).success(function(data) {
                    boolean.resolve(data);
                }).error(function(error) {
                    boolean.reject(error);
                });
                return boolean.promise;
            }
        }
    });