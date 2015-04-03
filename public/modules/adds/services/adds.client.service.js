'use strict';

//Adds service used to communicate Adds REST endpoints
angular.module('adds').factory('Adds', ['$resource',
	function($resource) {
		return $resource('adds/:addId', { addId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);