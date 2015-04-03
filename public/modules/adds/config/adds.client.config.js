'use strict';

// Configuring the Articles module
angular.module('adds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Survey Menu', 'adds', 'dropdown', '/adds(/create)?');
		Menus.addSubMenuItem('topbar', 'adds', 'Survey Lists', 'adds');
		Menus.addSubMenuItem('topbar', 'adds', 'Add Survey', 'adds/create');
	}
]);