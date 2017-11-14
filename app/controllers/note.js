"use strict";
const mongoose = require('mongoose');
const Note = mongoose.model('Note');

let noteCntrl = {
	index: function(req, res, next){
		Note.find({}).sort({createdAt: 'desc'})
			.then((notes) =>{
				res.render('note/index', {notes});	
			}).catch((err) =>{

			});
	},

	new: function(req, res, next){
		let errors = req.flash('errors');
		res.render('note/new', {errors});
	},

	create: function(req, res, next){
		let errors = req.flash('errors');
		let success = req.flash('progress');

		let new_note = new Note();
		new_note.title = req.body.title;
		new_note.description = req.body.description;

		new_note.save().then((note) => {
			req.flash('progress', `${note.title} has been create`);
			res.redirect('/notes');
		}).catch((err) => {
			req.flash('errors', err);
			res.redirect('/notes/new');
		});
	},

	edit: function(req, res, next){
		
	}
}

module.exports = noteCntrl;