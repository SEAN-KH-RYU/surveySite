'use strict';

//Setting up route
angular.module('surveycruds').config(['$stateProvider',
	function($stateProvider) {
		// Surveycruds state routing
		$stateProvider.
		state('listSurveycruds', {
			url: '/surveycruds',
			templateUrl: 'modules/surveycruds/views/list-surveycruds.client.view.html'
		}).
		state('createSurveycrud', {
			url: '/surveycruds/create',
			templateUrl: 'modules/surveycruds/views/create-surveycrud.client.view.html'
		}).
		state('viewSurveycrud', {
			url: '/surveycruds/:surveycrudId',
			templateUrl: 'modules/surveycruds/views/view-surveycrud.client.view.html'
		}).
		state('editSurveycrud', {
			url: '/surveycruds/:surveycrudId/edit',
			templateUrl: 'modules/surveycruds/views/edit-surveycrud.client.view.html'
		});
	}
]);