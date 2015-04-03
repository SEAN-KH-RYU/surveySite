'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Surveycrud = mongoose.model('Surveycrud'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, surveycrud;

/**
 * Surveycrud routes tests
 */
describe('Surveycrud CRUD tests', function() {
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

		// Save a user to the test db and create new Surveycrud
		user.save(function() {
			surveycrud = {
				name: 'Surveycrud Name'
			};

			done();
		});
	});

	it('should be able to save Surveycrud instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surveycrud
				agent.post('/surveycruds')
					.send(surveycrud)
					.expect(200)
					.end(function(surveycrudSaveErr, surveycrudSaveRes) {
						// Handle Surveycrud save error
						if (surveycrudSaveErr) done(surveycrudSaveErr);

						// Get a list of Surveycruds
						agent.get('/surveycruds')
							.end(function(surveycrudsGetErr, surveycrudsGetRes) {
								// Handle Surveycrud save error
								if (surveycrudsGetErr) done(surveycrudsGetErr);

								// Get Surveycruds list
								var surveycruds = surveycrudsGetRes.body;

								// Set assertions
								(surveycruds[0].user._id).should.equal(userId);
								(surveycruds[0].name).should.match('Surveycrud Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Surveycrud instance if not logged in', function(done) {
		agent.post('/surveycruds')
			.send(surveycrud)
			.expect(401)
			.end(function(surveycrudSaveErr, surveycrudSaveRes) {
				// Call the assertion callback
				done(surveycrudSaveErr);
			});
	});

	it('should not be able to save Surveycrud instance if no name is provided', function(done) {
		// Invalidate name field
		surveycrud.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surveycrud
				agent.post('/surveycruds')
					.send(surveycrud)
					.expect(400)
					.end(function(surveycrudSaveErr, surveycrudSaveRes) {
						// Set message assertion
						(surveycrudSaveRes.body.message).should.match('Please fill Surveycrud name');
						
						// Handle Surveycrud save error
						done(surveycrudSaveErr);
					});
			});
	});

	it('should be able to update Surveycrud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surveycrud
				agent.post('/surveycruds')
					.send(surveycrud)
					.expect(200)
					.end(function(surveycrudSaveErr, surveycrudSaveRes) {
						// Handle Surveycrud save error
						if (surveycrudSaveErr) done(surveycrudSaveErr);

						// Update Surveycrud name
						surveycrud.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Surveycrud
						agent.put('/surveycruds/' + surveycrudSaveRes.body._id)
							.send(surveycrud)
							.expect(200)
							.end(function(surveycrudUpdateErr, surveycrudUpdateRes) {
								// Handle Surveycrud update error
								if (surveycrudUpdateErr) done(surveycrudUpdateErr);

								// Set assertions
								(surveycrudUpdateRes.body._id).should.equal(surveycrudSaveRes.body._id);
								(surveycrudUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Surveycruds if not signed in', function(done) {
		// Create new Surveycrud model instance
		var surveycrudObj = new Surveycrud(surveycrud);

		// Save the Surveycrud
		surveycrudObj.save(function() {
			// Request Surveycruds
			request(app).get('/surveycruds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Surveycrud if not signed in', function(done) {
		// Create new Surveycrud model instance
		var surveycrudObj = new Surveycrud(surveycrud);

		// Save the Surveycrud
		surveycrudObj.save(function() {
			request(app).get('/surveycruds/' + surveycrudObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', surveycrud.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Surveycrud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surveycrud
				agent.post('/surveycruds')
					.send(surveycrud)
					.expect(200)
					.end(function(surveycrudSaveErr, surveycrudSaveRes) {
						// Handle Surveycrud save error
						if (surveycrudSaveErr) done(surveycrudSaveErr);

						// Delete existing Surveycrud
						agent.delete('/surveycruds/' + surveycrudSaveRes.body._id)
							.send(surveycrud)
							.expect(200)
							.end(function(surveycrudDeleteErr, surveycrudDeleteRes) {
								// Handle Surveycrud error error
								if (surveycrudDeleteErr) done(surveycrudDeleteErr);

								// Set assertions
								(surveycrudDeleteRes.body._id).should.equal(surveycrudSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Surveycrud instance if not signed in', function(done) {
		// Set Surveycrud user 
		surveycrud.user = user;

		// Create new Surveycrud model instance
		var surveycrudObj = new Surveycrud(surveycrud);

		// Save the Surveycrud
		surveycrudObj.save(function() {
			// Try deleting Surveycrud
			request(app).delete('/surveycruds/' + surveycrudObj._id)
			.expect(401)
			.end(function(surveycrudDeleteErr, surveycrudDeleteRes) {
				// Set message assertion
				(surveycrudDeleteRes.body.message).should.match('User is not logged in');

				// Handle Surveycrud error error
				done(surveycrudDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Surveycrud.remove().exec();
		done();
	});
});