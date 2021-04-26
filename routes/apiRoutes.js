const fs = require('fs');
const path = require('path');
const router = require('express').Router();
let { notes } = require('../db/db.json'); // not a const because we will rewrite it
const uniqid = require('uniqid');

router.get('/notes', (req, res) => {
  res.json(notes);
});

function validateNote(note) {
  if (!note.title) {
    return false;
  }
  if (!note.text) {
    return false;
  }
  return true;
}

router.post('/notes', (req, res) => {
  // req.body is where our incoming content will be
  req.body.id = uniqid();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The note is incomplete.');
  } else {
  const note = createNewNote(req.body, notes);
  res.json(note);
  }
});

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, '../db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

router.delete('/notes/:id', function (req, res) {
  const id = req.params.id;
  const updatedNotes = notes.filter(data => data.id != id);
  fs.writeFile('./db/db.json', JSON.stringify({ notes: updatedNotes }, null, 2), function () {
    notes = updatedNotes;
    res.json(updatedNotes);
  });
});

module.exports = router;