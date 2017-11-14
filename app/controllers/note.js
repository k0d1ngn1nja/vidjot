"use strict";
const mongoose = require('mongoose');
const Note = mongoose.model('Note');

let noteCntrl = {
	index: function(req, res, next){
		let errors = req.flash('errors');

		Note.find({}).sort({createdAt: 'desc'})
			.then((notes) =>{
				res.render('note/index', {notes, errors});	
			}).catch((err) =>{
				res.flash('errors', err);
				res.render('pages/index', {errors})
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
		let noteID = req.params.id;
		Note.findOne({_id: noteID}).then((note) =>{
			res.render('note/edit', {note});
		}).catch((err) =>{
			req.flash('errors', err);
			res.redirect('back');
		});
	},

	update: function(req, res, next){
		let noteID = req.params.id;
		let note = {};
		note.title = req.body.title;
		note.description = req.body.description;
		
		Note.findByIdAndUpdate(noteID, note, (err, note) =>{
			if(err){
				console.log(err);
				req.flash('errors', err);
				return res.redirect('back');
			}
			req.flash('progress', `${note.title} has been updated.`);
			res.redirect(`/notes`);
		});
	}
}

module.exports = noteCntrl;