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
    questions: [
        {
            question: { type: String, default: ''},
            select1: { type: String, default: ''},
            select2: { type: String, default: ''},
            select3: { type: String, default: ''},
            select4: { type: String, default: ''},
            selected : { type: Number, default: 0}
        }
    ],
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