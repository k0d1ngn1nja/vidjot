"use strict";
const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const v = require('../config/validation');
const authCntrl = require('../controllers/auth');

router.get('/signup', authCntrl.signupGET);

router.post('/signup', v.validateSignup, authCntrl.signupPOST);

router.get('/login', authCntrl.loginGET);

router.post('/login', v.validateLogin, authCntrl.loginPOST);

router.get('/logout', authCntrl.logout);

router.get('/forgotpassword', authCntrl.forgot);

router.post('/forgotpassword', v.validatedForgotPwd, authCntrl.forgotPWD);

router.get('/reset/:token', authCntrl.reset);

router.post('/reset/:token', v.validatedResetPwd, authCntrl.resetPWD);

module.exports = router;