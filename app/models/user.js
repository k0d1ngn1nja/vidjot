"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const uniqueValidator = require('mongoose-unique-validator');

let UserSchema = new Schema({
	username: {
		type: String,
		lowerCase: true,
		unique: true,
		required: [true, "Username can't be blank."],
		index: true,
		minlength: 5,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: [true, "Email can't be blank."],
		index: true
	},
	password: {
		type: String,
		trim: true,
		required: [true, "Password can't be blank."]
	},
	passwordResetToken: {type: String, default:''},
	passwordResetExpires: {type: Date, default: Date.now}
});

UserSchema.methods.encryptPWD = function(pwd){
	return bcrypt.hashSync(pwd);
};

UserSchema.methods.validatePWD = function(pwd){
	return bcrypt.compareSync(pwd, this.password);
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);