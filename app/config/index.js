"use strict";
module.exports = {
	productionEnv: {
		db: (process.env.DB || "mongodb://admin:password123@ds235775.mlab.com:35775/justsellit"),
		secret: process.env.SECRET,
		auth: {
			user: 'sam.gdouglas@gmail.com',
			pass: 'Aleesi@12'
		}
	},
	localEnv:{
		db: 'mongodb://localhost:27017/justsellit',
		secret:  '#ggmu',
		auth: {
			user: 'sam.gdouglas@gmail.com',
			pass: 'Aleesi@12'
		}
	}
}