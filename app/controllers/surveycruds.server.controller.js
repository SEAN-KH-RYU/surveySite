'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Surveycrud = mongoose.model('Surveycrud'),
	_ = require('lodash');

/**
 * Create a Surveycrud
 */
exports.create = function(req, res) {
	var surveycrud = new Surveycrud(req.body);
	surveycrud.user = req.user;

	surveycrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surveycrud);
		}
	});
};

/**
 * Show the current Surveycrud
 */
exports.read = function(req, res) {
	res.jsonp(req.surveycrud);
};

/**
 * Update a Surveycrud
 */
exports.update = function(req, res) {
    console.log('exports.update');
	var surveycrud = req.surveycrud ;
    
	surveycrud = _.extend(surveycrud , req.body);

	surveycrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surveycrud);
		}
	});
};

/**
 * Delete an Surveycrud
 */
exports.delete = function(req, res) {
	var surveycrud = req.surveycrud ;

	surveycrud.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surveycrud);
		}
	});
};

/**
 * List of Surveycruds
 */
exports.list = function(req, res) { 
	Surveycrud.find().sort('-created').populate('user', 'displayName').exec(function(err, surveycruds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surveycruds);
		}
	});
};

/**
 * Surveycrud middleware
 */
exports.surveycrudByID = function(req, res, next, id) { 
	Surveycrud.findById(id).populate('user', 'displayName').exec(function(err, surveycrud) {
		if (err) return next(err);
		if (! surveycrud) return next(new Error('Failed to load Surveycrud ' + id));
		req.surveycrud = surveycrud ;
		next();
	});
};

/**
 * Surveycrud authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.surveycrud.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
