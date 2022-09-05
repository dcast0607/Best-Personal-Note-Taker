// We import the uuid helper file, we will use this in our notes object definition.

const uuid = require("./uuid");

const fs = require("fs");

// We initialize a few test entries that we can use to seed data.
const notes = [
  {
    title: "Test Title",
    text: "Test text",
    noteId: uuid(),
  },
  {
    title: "Test Note 1",
    text: "Test text 1",
    noteId: uuid(),
  },
  {
    title: "Test Note 2",
    text: "Test text",
    noteId: uuid(),
  },
  {
    title: "Test Note 3",
    text: "Catcher note",
    noteId: "0001"
  }
];

function checkExistingData (existingNotes) {
  existingNotes.forEach((note) => {
    if (note.noteId = "0001") {
      return true;
    }
  })
  return false;
};

function seedNotesData () {
  
  const existingNotes = [];

  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    //console.log(JSON.parse(data));
    JSON.parse(data).forEach((datum) => {
      existingNotes.push(datum);
    })
    console.log(existingNotes);
    notes.forEach((note) => {
      existingNotes.push(note);
    });
    console.log(existingNotes);

    fs.writeFile('./db/db.json', JSON.stringify(existingNotes), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      });
  });
}


seedNotesData();