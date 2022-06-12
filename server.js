const express = require('express');
const path = require('path');
const noteData = require('./db/db');
const uuid = require('./db/helpers/uuid');
const fs = require('fs');
const util = require('util');
const { json } = require('express/lib/response');
const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

const readFromFile = util.promisify(fs.readFile);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });


app.get('/api/notes', (req, res) => {
    res.status(200);
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    console.info(req.body);
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        noteId: uuid(),
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

// NOTE DELETE Route may need work. 
app.delete('/api/notes/:noteId', (req, res) => {
    let noteRequestId = req.params.noteId;
    if (noteRequestId) {
        res.status(201);
        console.log("Delete request received for " + noteRequestId + ".");
    }
    else {
        res.status(501);
        console.log("Please include a valid Note ID");
    }
});

app.get('*', (req, res) =>
   res.send(
    `Whoops, that's an invalid link. Please navigate to  <a href="http://localhost/">http://localhost:${PORT}/</a>`
   )
);

app.listen(PORT, () => {
    console.log(`Personal Note Taker app listening at http://localhost:${PORT}`);
});