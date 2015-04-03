'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Surveycrud Schema
 */
var SurveycrudSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Surveycrud name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Surveycrud', SurveycrudSchema);