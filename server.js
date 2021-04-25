const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const { notes } = require('./db/db.json');

app.get('/api/notes', (req, res) => {
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

app.post('/api/notes', (req, res) => {
  // req.body is where our incoming content will be
  req.body.id = notes.length.toString();

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
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});