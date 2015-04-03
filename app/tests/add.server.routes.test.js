'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Add = mongoose.model('Add'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, add;

/**
 * Add routes tests
 */
describe('Add CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Add
		user.save(function() {
			add = {
				name: 'Add Name'
			};

			done();
		});
	});

	it('should be able to save Add instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Add
				agent.post('/adds')
					.send(add)
					.expect(200)
					.end(function(addSaveErr, addSaveRes) {
						// Handle Add save error
						if (addSaveErr) done(addSaveErr);

						// Get a list of Adds
						agent.get('/adds')
							.end(function(addsGetErr, addsGetRes) {
								// Handle Add save error
								if (addsGetErr) done(addsGetErr);

								// Get Adds list
								var adds = addsGetRes.body;

								// Set assertions
								(adds[0].user._id).should.equal(userId);
								(adds[0].name).should.match('Add Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Add instance if not logged in', function(done) {
		agent.post('/adds')
			.send(add)
			.expect(401)
			.end(function(addSaveErr, addSaveRes) {
				// Call the assertion callback
				done(addSaveErr);
			});
	});

	it('should not be able to save Add instance if no name is provided', function(done) {
		// Invalidate name field
		add.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Add
				agent.post('/adds')
					.send(add)
					.expect(400)
					.end(function(addSaveErr, addSaveRes) {
						// Set message assertion
						(addSaveRes.body.message).should.match('Please fill Add name');
						
						// Handle Add save error
						done(addSaveErr);
					});
			});
	});

	it('should be able to update Add instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Add
				agent.post('/adds')
					.send(add)
					.expect(200)
					.end(function(addSaveErr, addSaveRes) {
						// Handle Add save error
						if (addSaveErr) done(addSaveErr);

						// Update Add name
						add.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Add
						agent.put('/adds/' + addSaveRes.body._id)
							.send(add)
							.expect(200)
							.end(function(addUpdateErr, addUpdateRes) {
								// Handle Add update error
								if (addUpdateErr) done(addUpdateErr);

								// Set assertions
								(addUpdateRes.body._id).should.equal(addSaveRes.body._id);
								(addUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Adds if not signed in', function(done) {
		// Create new Add model instance
		var addObj = new Add(add);

		// Save the Add
		addObj.save(function() {
			// Request Adds
			request(app).get('/adds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Add if not signed in', function(done) {
		// Create new Add model instance
		var addObj = new Add(add);

		// Save the Add
		addObj.save(function() {
			request(app).get('/adds/' + addObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', add.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Add instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Add
				agent.post('/adds')
					.send(add)
					.expect(200)
					.end(function(addSaveErr, addSaveRes) {
						// Handle Add save error
						if (addSaveErr) done(addSaveErr);

						// Delete existing Add
						agent.delete('/adds/' + addSaveRes.body._id)
							.send(add)
							.expect(200)
							.end(function(addDeleteErr, addDeleteRes) {
								// Handle Add error error
								if (addDeleteErr) done(addDeleteErr);

								// Set assertions
								(addDeleteRes.body._id).should.equal(addSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Add instance if not signed in', function(done) {
		// Set Add user 
		add.user = user;

		// Create new Add model instance
		var addObj = new Add(add);

		// Save the Add
		addObj.save(function() {
			// Try deleting Add
			request(app).delete('/adds/' + addObj._id)
			.expect(401)
			.end(function(addDeleteErr, addDeleteRes) {
				// Set message assertion
				(addDeleteRes.body.message).should.match('User is not logged in');

				// Handle Add error error
				done(addDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Add.remove().exec();
		done();
	});
});