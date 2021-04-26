



const fs = require('fs');
const path = require('path');
// used to create unique IDs
const uniqid = require('uniqid');


const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const PORT = process.env.PORT || 3001;

const express = require('express');
const app = express();

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});


const { notes } = require('./db/db.json');





app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
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
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.delete("/api/notes/:id", function (req, res) {
  const id = req.params.id;
  // Delete the note from array
  notes.splice(id - 1, 1);
  // Reassign id for remaining notes
  notes.forEach((obj, i) => {
    obj.id = uniqid();
  });
  // Return the remaining notes to the client
  fs.writeFile("./db/db.json", JSON.stringify({ notes: notes }, null, 2), function () {
    res.json(notes);
  });
});

