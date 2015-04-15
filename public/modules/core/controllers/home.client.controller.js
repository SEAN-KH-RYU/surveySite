'use strict';
var questionID;
// Surveycruds controller
angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location', 'Authentication', 'Surveycruds',
	function($scope, $stateParams, $location, Authentication, Surveycruds) {
		$scope.authentication = Authentication;

		// Find a list of Surveycruds
		$scope.find = function() {
			$scope.surveycruds = Surveycruds.query();
		};
	}
]);