'use strict';

// Surveycruds controller
angular.module('surveycruds').controller('SurveycrudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Surveycruds',
	function($scope, $stateParams, $location, Authentication, Surveycruds) {
		$scope.authentication = Authentication;

		// Create new Surveycrud
		$scope.create = function() {
			// Create new Surveycrud object
			var surveycrud = new Surveycruds ({
				name: this.name
			});

			// Redirect after save
			surveycrud.$save(function(response) {
				$location.path('surveycruds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Surveycrud
		$scope.remove = function(surveycrud) {
			if ( surveycrud ) { 
				surveycrud.$remove();

				for (var i in $scope.surveycruds) {
					if ($scope.surveycruds [i] === surveycrud) {
						$scope.surveycruds.splice(i, 1);
					}
				}
			} else {
				$scope.surveycrud.$remove(function() {
					$location.path('surveycruds');
				});
			}
		};

		// Update existing Surveycrud
		$scope.update = function() {
			var surveycrud = $scope.surveycrud;

			surveycrud.$update(function() {
				$location.path('surveycruds/' + surveycrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Surveycruds
		$scope.find = function() {
			$scope.surveycruds = Surveycruds.query();
		};

		// Find existing Surveycrud
		$scope.findOne = function() {
			$scope.surveycrud = Surveycruds.get({ 
				surveycrudId: $stateParams.surveycrudId
			});
		};
	}
]);