"use strict";
const router = require('express').Router();
const mongoose = require('mongoose');
const Note = mongoose.model('Note');
const v = require('../config/validation');
const noteCntrl = require('../controllers/note');

router.get('/notes', v.isLoggedIn, noteCntrl.index);

router.get('/notes/new', v.isLoggedIn, noteCntrl.new);

router.get('/notes/:id/edit', v.isLoggedIn, v.isCreator, noteCntrl.edit);

router.put('/notes/:id', v.isLoggedIn, v.isCreator, noteCntrl.update);

router.post('/notes', v.validateNewNote, v.isLoggedIn, noteCntrl.create);

router.delete('/notes/:id', v.isLoggedIn, v.isCreator, noteCntrl.delete);

module.exports = router;