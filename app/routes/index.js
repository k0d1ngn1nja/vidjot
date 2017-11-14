"use strict";
const router = require('express').Router();

router.get('/', (req, res, next) =>{
	let success = req.flash('progress');
	let errors = req.flash('errors');
	
	res.render('pages/index', {title: "Home || NoteTaker", success, errors});
});

router.get('/about', (req, res, next) =>{
	res.render('pages/about');
});

router.get('/contact', (req, res, next) =>{
	res.render('pages/contact');
});


module.exports = router;