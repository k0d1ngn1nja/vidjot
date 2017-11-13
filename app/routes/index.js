"use strict";
const router = require('express').Router();

router.get('/', (req, res, next) =>{
	let success = req.flash('progress');
	res.render('pages/index', {title: "Home || JustSellIt", success});
});

router.get('/about', (req, res, next) =>{
	res.render('pages/about');
});

router.get('/contact', (req, res, next) =>{
	res.render('pages/contact');
});


module.exports = router;