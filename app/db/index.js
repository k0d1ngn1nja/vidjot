"use strict";
const mongoose = require('mongoose');
const config = require('../config');
const isProduction =(process.env.NODE_ENV === 'production');

mongoose.Promise = global.Promise;

if(isProduction){
	mongoose.connect(config.productionEnv.db, {useMongoClient: true })
		.then(() => console.log('Connected to local database'))
		.catch((err) => console.log("Mongoose connection error occurred ", err));
} else {
	mongoose.connect(config.localEnv.db, {useMongoClient: true })
		.then(() => console.log('Connected to local database'))
		.catch((err) => console.log("Mongoose connection error occurred ", err));
}