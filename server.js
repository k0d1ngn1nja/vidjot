"use strict";

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const logger = require('morgan');
const session = require('express-session');
const SessionStore = require('connect-mongo')(session);
const ejslayout = require('express-ejs-layouts');
const passport = require('passport');
const port = (process.env.PORT || 3000);
const config = require('./app/config');
const validator = require('express-validator');
const http = require('http').Server(app);

// DB CONNECTION
require('./app/db');

// MIDDLEWARES
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: config.localEnv.secret,
	store: new SessionStore({url: config.localEnv.db, autoReconnect: true})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// SETTING CURRENT USER & FLASH 
app.use(function(req, res, next){
	res.locals.currentuser = req.user;
	next();
});

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.use(ejslayout);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// MODELS
require('./app/models/user');
require('./app/models/note');

// ROUTES
app.use(require('./app/routes'));
app.use(require('./app/routes/auth'));
app.use(require('./app/routes/note'));

// ERROR HANDLING
require('./app/config/error-handlers')(app);

// INITIALIZE SERVER
http.listen(port, (err) =>{
	if(err) return console.log('Server error just occurred...', err);
	console.log(`Server is live on port ${port}`);
});