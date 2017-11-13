"use strict";

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// stores user id in session
passport.serializeUser(function(user, done){
	done(null, user.id);
});

// Retrieve stored user in the session
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
	}, function(req, email, pwd, done){
	User.findOne({email}, function(err, user){
		if(err) return done(err);
		if(!user) return done(null, false, req.flash('errors', "No user found with those credentials."));
		if(!user.validatePWD(pwd)) return done(null, false, req.flash('errors', "Invalid email/password combination."));
		return done(null, user);
	});
}));