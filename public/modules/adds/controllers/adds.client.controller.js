'use strict';

// Adds controller
angular.module('adds').controller('AddsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Adds Survey',
	function($scope, $stateParams, $location, Authentication, Adds) {
		$scope.authentication = Authentication;

		// Create new Add
		$scope.create = function() {
			// Create new Add object
			var add = new Adds ({
				name: this.name
			});

			// Redirect after save
			add.$save(function(response) {
				$location.path('adds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Add
		$scope.remove = function(add) {
			if ( add ) { 
				add.$remove();

				for (var i in $scope.adds) {
					if ($scope.adds [i] === add) {
						$scope.adds.splice(i, 1);
					}
				}
			} else {
				$scope.add.$remove(function() {
					$location.path('adds');
				});
			}
		};

		// Update existing Add
		$scope.update = function() {
			var add = $scope.add;

			add.$update(function() {
				$location.path('adds/' + add._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Adds
		$scope.find = function() {
			$scope.adds = Adds.query();
		};

		// Find existing Add
		$scope.findOne = function() {
			$scope.add = Adds.get({ 
				addId: $stateParams.addId
			});
		};
	}
]);