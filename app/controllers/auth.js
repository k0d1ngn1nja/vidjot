"use strict";
const pageTitle = "JustSellIt";
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('../config/passport');
const config = require('../config');
const User = mongoose.model('User');
const appName = "JustSellIt";
const mailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

let authCntrl = {
	signupGET: function(req, res, next){
		let errors = req.flash('errors');
		let success = req.flash('progress');

		res.render('auth/signup', {errors, success});
	},

	signupPOST: function(req, res, next){
		User.findOne({email: req.body.email}, function(err, existingUser){
			if(existingUser) {
				req.flash('errors', 'Email already exist within our system.');
				return res.redirect('/signup');
			}
					
			let user = new User();
			user.username = req.body.username;
			user.email = req.body.email;
			user.password = user.encryptPWD(req.body.password);

			user.save((err) =>{
				if(err){
					req.flash('errors', err.message);
					res.redirect('/signup');
				} else {
					res.redirect('/login');
				}
			});
		});
	},

	loginGET: function(req, res, next){
		let errors = req.flash('errors');
		if(req.user) res.redirect('/');
		res.render('auth/login', {errors});
	},

	loginPOST: passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true 
	}),

	logout: function(req, res, next){
		req.logout();
		req.flash('progress', 'Logout was successful.');
		res.redirect('/');
	},

	forgot: function(req, res, next){
		let errors = req.flash('errors');
		let info = req.flash('info');
		
		res.render('auth/forgotPWD', {errors, info});
	},

	forgotPWD: function(req, res, next){
		async.waterfall([
			function(cb){
				crypto.randomBytes(20, (err, buffer) =>{
					let token = buffer.toString('hex');
					cb(err, token);
				})
			},
			
			function(token, cb){
				User.findOne({'email': req.body.forgotPwdEmail}, (err, user) =>{
					if(!user) {
						req.flash('errors', "Email provided is invalid/doesn't exists");
						return res.redirect('/forgotpassword');
					}

					user.passwordResetToken = token;
					user.passwordResetExpires = Date.now() + 60*60*1000; //1hr
					user.save((err) =>{
						cb(err, token, user);
					});
				});
			},

			function(token, user, cb){
				let smtpTransport = mailer.createTransport({
					service: 'Gmail',
					auth: {
						user: config.localEnv.auth.user,
						pass: config.localEnv.auth.pass
					}
				});

				let mailOptions = {
					to: user.email,
					from: 'JustSellIt '+'<'+config.localEnv.auth.user+'>',
					subject: "JustSellIt: Password Reset Token",
					text: "You just requested for a password reset token. \n\n"+
								"Please click on the link to complete the process: \n\n"+
								`http://localhost:3000/reset/${token} \n\n`
				};

				smtpTransport.sendMail(mailOptions, (err, response) =>{
					req.flash('info', "Password reset token was just sent to "+user.email);
					return cb(err, user);
				});
			}
		], (err) =>{
			if(err) return next(err);
			res.redirect('/forgotpassword');
		})
	},

	reset: function(req, res, next){
		let errors = req.flash('errors');
		let success = req.flash('progress');

		let token = req.params.token;
		User.findOne({
			passwordResetToken: token, 
			passwordResetExpires: {$gt: Date.now()}}, (err, user) =>{
				if(!user){
					req.flash("errors", "Password reset token has expired or is invalid.");
					return res.redirect('/forgotpassword');
				}
				res.render('auth/reset', {title: "Reset Password || JustSellIt", errors, token, success});
		});
	},

	resetPWD: function(req, res, next){
		let token = req.params.token;
		let errors = req.flash('errors');

		User.findOne({passwordResetToken: token, passwordResetExpires: {$gt: Date.now()}}, (err, user) =>{
			if(!user){
				req.flash("errors", "Password reset token has expired or is invalid.");
				return res.redirect('/forgotpassword');
			}

			if(req.body.password === req.body.cpassword){
				user.password = user.encryptPWD(req.body.password);
				user.passwordResetToken = undefined;
				user.passwordResetExpires = undefined;

				user.save((err) =>{
					req.flash('progress', "Your password has been updated.");
					res.redirect('/');
				});
			} else {
				req.flash("errors", "Password and confirm password don't match.");
				res.redirect('/reset/'+req.params.token);
			}				
		});
	}
}

module.exports = authCntrl;