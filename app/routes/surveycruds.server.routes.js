'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var surveycruds = require('../../app/controllers/surveycruds.server.controller');

    var core = require('../../app/controllers/core.server.controller');
    app.route('/').get(core.index);
    
	// Surveycruds Routes
	app.route('/surveycruds')
		.get(surveycruds.list)
		.post(users.requiresLogin, surveycruds.create);

	app.route('/surveycruds/:surveycrudId')
		.get(surveycruds.read)
		.put(users.requiresLogin, surveycruds.hasAuthorization, surveycruds.update)
		.delete(users.requiresLogin, surveycruds.hasAuthorization, surveycruds.delete);

	// Finish by binding the Surveycrud middleware
	app.param('surveycrudId', surveycruds.surveycrudByID);
};
