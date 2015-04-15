'use strict';

// Configuring the Articles module
angular.module('surveycruds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Survey Menu', 'surveycruds', 'dropdown', '/surveycruds(/create)?');
		Menus.addSubMenuItem('topbar', 'surveycruds', 'Survey List', 'surveycruds');
		Menus.addSubMenuItem('topbar', 'surveycruds', 'Add New Survey', 'surveycruds/create');
	}
]);