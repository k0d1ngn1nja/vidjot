"use strict";
const User = require('../models/user');
const Note = require('../models/note');

function validateSignup(req, res, next){
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('username', 'Username length must be greater than 5 characters.').isLength({min:5});
	req.checkBody('email','Email must be provided').notEmpty();
	req.checkBody('email','Email is invalid').isEmail();
	req.checkBody('password','Password must be provided').notEmpty();
	req.checkBody('password', 'Password length must be greater than 6.').isLength({min:6});
	req.checkBody('confirm_password', 'Password do not match').equals(req.body.confirm_password).notEmpty();
	
	let errors = req.validationErrors();
	if(errors){
		let msgs = [];
		errors.forEach(function(err) {
			msgs.push(err.msg);
		});

		req.flash('errors', msgs);
		res.redirect('/signup');
	} else {
		return next();
	}
};

function validateLogin(req, res, next){
	req.checkBody('email','Email must be provided').notEmpty();
	req.checkBody('email','Email is invalid').isEmail();
	req.checkBody('password','Password must be provided').notEmpty();
	
	let errors = req.validationErrors();
	if(errors){
		let msgs = [];
		errors.forEach(function(err) {
			msgs.push(err.msg);
		});

		req.flash('errors', msgs);
		res.redirect('/login');
	} else {
		return next();
	}
};

function validatedForgotPwd(req, res, next){
	req.checkBody('forgotPwdEmail','Email must be provided').notEmpty();
	req.checkBody('forgotPwdEmail','Email is invalid').isEmail();

	let errors = req.validationErrors();
	if(errors){
		let msgs = [];
		errors.forEach(function(err) {
			msgs.push(err.msg);
		});

		req.flash('errors', msgs);
		res.redirect('/forgotpassword');
	} else {
		next();
	}
}

function validatedResetPwd(req, res, next){
	req.checkBody('password','Password must be provided').notEmpty();
	req.checkBody('password', 'Password length must be greater than 6.').isLength({min:6});
	req.checkBody('cpassword','Confirmation Password must be provided').notEmpty();
	req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
	if(errors){
		let msgs = [];
		errors.forEach(function(err) {
			msgs.push(err.msg);
		});

		req.flash('errors', msgs);
		res.redirect('/reset/'+req.params.token);
	} else {
		next();
	}
}

function validateNewNote(req, res, next){
	req.checkBody('title','Title must be provided').notEmpty();
	req.checkBody('description','Description must be provided').notEmpty();

	let errors = req.validationErrors();
	if(errors){
		let msgs = [];
		errors.forEach(function(err) {
			msgs.push(err.msg);
		});

		req.flash('errors', msgs);
		res.redirect('/notes/new');
	} else {
		next();
	}
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.session.oldUrl = req.url;
  req.flash('errors', 'Please login to continue.');
  res.redirect('/login');
}

function isCreator(req, res, next){
	let noteID = req.params.id;

	if(req.isAuthenticated()){
		Note.findById(noteID, (err, note) =>{
			if(err || !note){
				req.flash('errors', "Note not found");
				return res.redirect('/');
			} else if(note.owner.equals(req.user._id)){
				next();
			} else {
				req.flash('errors', "Unauthorized action!");
				res.redirect("/");
			}
		});
	} else {
		req.flash('errors', 'You need to be logged-in to perform this action.');
		res.redirect('back');
	}
}

module.exports = {
	validateSignup,
	validateLogin,
	validatedResetPwd,
	validatedForgotPwd,
	validateNewNote,
	isLoggedIn,
	isCreator
}