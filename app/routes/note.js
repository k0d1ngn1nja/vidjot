"use strict";
const router = require('express').Router();
const mongoose = require('mongoose');
const Note = mongoose.model('Note');
const v = require('../config/validation');
const noteCntrl = require('../controllers/note');

router.get('/notes', noteCntrl.index);

router.get('/notes/new', noteCntrl.new);

router.get('/notes/:id/edit', noteCntrl.edit);

router.post('/notes', v.validateNewNote, noteCntrl.create);

module.exports = router;