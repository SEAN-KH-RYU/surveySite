'use strict';

// Configuring the Articles module
angular.module('surveycruds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Surveycruds', 'surveycruds', 'dropdown', '/surveycruds(/create)?');
		Menus.addSubMenuItem('topbar', 'surveycruds', 'List Surveycruds', 'surveycruds');
		Menus.addSubMenuItem('topbar', 'surveycruds', 'New Surveycrud', 'surveycruds/create');
	}
]);