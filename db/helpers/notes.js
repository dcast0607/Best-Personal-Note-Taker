// We import the uuid helper file, we will use this in our notes object definition.

const uuid = require("./uuid");

// We will be using fs to read and write to the existing db.json file. This will
// let us seed data into this file.
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

// We create a function that will read data from the existing db.json file. We then
// use the forEach array method to iterate through the data so that we can add our seed
// data on top of the existing notes data. Once we have read through the data, we then 
// cycle through the seeded notes data above so that it can be added to the existing notes data.
// Once we have an array that contains both our old data and new data, we user the writeFile method
// to update the existing notes with data from our notes array. 
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

// We call the seedNotesData function here. 
seedNotesData();