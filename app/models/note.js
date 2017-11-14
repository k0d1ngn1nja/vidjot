"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let NoteSchema = new Schema({
	title: {
		type: String,
		required: [true, "Title field can't be blank."],
		unique: true,
		minlength: 5
	},
	description:{
		type: String,
		required: [true, "Note description required"],
		minlength: 10
	},

	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, {timestamps: true});

NoteSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Note', NoteSchema);