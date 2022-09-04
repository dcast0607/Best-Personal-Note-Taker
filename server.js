// We bring in the require packages and the right files.

const express = require('express');
const path = require('path');
const uuid = require('./db/helpers/uuid');
const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

// We define a local port so that we can test the application
// locally. 
const PORT = process.env.PORT || 3001;

// Express app is initialized. 
const app = express();


app.use(express.urlencoded(
  { 
    extended: true
  })
);

app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE"
    );
    next();
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    res.status(200);
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

      readFromFile('./db/db.json').then((data) => 
      {
        let parsedNotesData = JSON.parse(data);
        //console.log(parsedNotesData);
        //console.log(newNote);
        parsedNotesData = parsedNotesData.concat(newNote);
        //console.log(parsedNotesData);
        console.log(parsedNotesData);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotesData), function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
        }); 
      });

  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

// NOTE DELETE Route may need work. 
app.delete('/api/notes/:noteIndex', (req, res) => {

    readFromFile('./db/db.json').then((data) => {
      let noteRequestId = req.params.noteIndex;
      console.log(noteRequestId);
      
      let currentParsedNotesData = JSON.parse(data);
      const currentSavedNotesLength = currentParsedNotesData.length;
      console.log(currentSavedNotesLength);
      // Need to specify index of note to delete it. 
      currentParsedNotesData.splice(noteRequestId, 1);
      console.log(currentParsedNotesData);
      const deletedNotesLength = currentParsedNotesData.length;
      console.log(deletedNotesLength);
      
      if (currentSavedNotesLength > deletedNotesLength) {
        fs.writeFile('./db/db.json', JSON.stringify(currentParsedNotesData), function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
          });
          res.status(201).json("Delete request received for note " + noteRequestId + ".");
      }
      else {
        res.status(501).json("Please include a valid Note ID.");
      }
    });

});

app.get('*', (req, res) => {
  console.log("Whoops that's an invalid request!");
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Personal Note Taker app listening at http://localhost:${PORT}`);
});