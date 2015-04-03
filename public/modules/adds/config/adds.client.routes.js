'use strict';

//Setting up route
angular.module('adds').config(['$stateProvider',
	function($stateProvider) {
		// Adds state routing
		$stateProvider.
		state('question', {
			url: '/question',
			templateUrl: 'modules/adds/views/question.client.view.html'
		}).
		state('listAdds', {
			url: '/adds',
			templateUrl: 'modules/adds/views/list-adds.client.view.html'
		}).
		state('createAdd', {
			url: '/adds/create',
			templateUrl: 'modules/adds/views/create-add.client.view.html'
		}).
		state('viewAdd', {
			url: '/adds/:addId',
			templateUrl: 'modules/adds/views/view-add.client.view.html'
		}).
		state('editAdd', {
			url: '/adds/:addId/edit',
			templateUrl: 'modules/adds/views/edit-add.client.view.html'
		});
	}
]);