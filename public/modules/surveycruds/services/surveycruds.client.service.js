'use strict';

//Surveycruds service used to communicate Surveycruds REST endpoints
angular.module('surveycruds').factory('Surveycruds', ['$resource',
	function($resource) {
		return $resource('surveycruds/:surveycrudId', { surveycrudId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);