'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var adds = require('../../app/controllers/adds.server.controller');

	// Adds Routes
	app.route('/adds')
		.get(adds.list)
		.post(users.requiresLogin, adds.create);

	app.route('/adds/:addId')
		.get(adds.read)
		.put(users.requiresLogin, adds.hasAuthorization, adds.update)
		.delete(users.requiresLogin, adds.hasAuthorization, adds.delete);

	// Finish by binding the Add middleware
	app.param('addId', adds.addByID);
};
