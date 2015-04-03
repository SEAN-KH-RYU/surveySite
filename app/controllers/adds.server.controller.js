'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Add = mongoose.model('Add'),
	_ = require('lodash');

/**
 * Create a Add
 */
exports.create = function(req, res) {
	var add = new Add(req.body);
	add.user = req.user;

	add.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(add);
		}
	});
};

/**
 * Show the current Add
 */
exports.read = function(req, res) {
	res.jsonp(req.add);
};

/**
 * Update a Add
 */
exports.update = function(req, res) {
	var add = req.add ;

	add = _.extend(add , req.body);

	add.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(add);
		}
	});
};

/**
 * Delete an Add
 */
exports.delete = function(req, res) {
	var add = req.add ;

	add.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(add);
		}
	});
};

/**
 * List of Adds
 */
exports.list = function(req, res) { 
	Add.find().sort('-created').populate('user', 'displayName').exec(function(err, adds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adds);
		}
	});
};

/**
 * Add middleware
 */
exports.addByID = function(req, res, next, id) { 
	Add.findById(id).populate('user', 'displayName').exec(function(err, add) {
		if (err) return next(err);
		if (! add) return next(new Error('Failed to load Add ' + id));
		req.add = add ;
		next();
	});
};

/**
 * Add authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.add.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
