
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
//Defines a base URL Path for our API requests. 

//const baseURL = 'http://localhost:3001';
const baseURL = 'https://lit-oasis-69876.herokuapp.com';

// Checks the current page index. If the user is on the "notes.html" page, then we
// defined a few selectors. We are using 'window.location.pathname' to pull the current
// user page. We then take the split method to split the URL by the "/" character, and 
// create an array based off our webpage URL. This is then compared against an if statement
// to check if we need to retrieve a few selectors from the page. 
let currentPage = window.location.pathname.split('/');
//console.log(currentPage);
let currentPageIndex = currentPage.pop();
//console.log(currentPageIndex);

if (currentPageIndex === 'notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container, .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch(baseURL + '/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json()
  )
  .then((data) => {
      console.log(data);
      return data;
  })
  .catch((error) => {
    console.error('Error:', error);
  });


const saveNote = (note) =>
  fetch(baseURL + '/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
  .then((response) => response.json()
  )
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.error('Error:', error);
  });


const deleteNote = (id) =>
  fetch(baseURL + `/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.error('Error:', error);
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleSavedNoteRender = (e) => {
  e.stopPropagation();

  const clickedNote = e.target;
  const clickedNoteElement = e.target.className;

  const addNoteContent = (noteTitle, noteText) => {
    const noteTitleTarget = document.getElementById('main-note-title');
    const noteTextTarget = document.getElementById('main-text-area');

    noteTitleTarget.value = noteTitle;
    noteTextTarget.value = noteText;
  };

  if (clickedNoteElement === "list-item-title") {
    console.log("User clicked on title");
    const noteTitle = JSON.parse(clickedNote.parentElement.getAttribute("data-note")).title;
    const noteText = JSON.parse(clickedNote.parentElement.getAttribute("data-note")).text;
    console.log(noteTitle, noteText);
    console.log(typeof(noteTitle), typeof(noteText));
    addNoteContent(noteTitle, noteText);

  }
  else if (clickedNoteElement === "list-group-item") {
    console.log("User clicked on parent item");
    const noteTitle = JSON.parse(clickedNote.getAttribute("data-note")).title;
    const noteText = JSON.parse(clickedNote.getAttribute("data-note")).text;
    console.log(noteTitle, noteText);
    console.log(typeof(noteTitle), typeof(noteText));
    addNoteContent(noteTitle, noteText);
  }
  else {
    console.log("Button Clicked");
  }


}

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note-index'));

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  const jsonNotes = notes;
  console.log(jsonNotes);
  if (currentPageIndex === 'notes.html') {
    //console.log("Notes page loaded");
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.addEventListener('click', handleSavedNoteRender);

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  let jsonNotesIndex = 0;
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    li.dataset.noteIndex = jsonNotesIndex;
    jsonNotesIndex++;
    noteListItems.push(li);
  });

  if (currentPageIndex === 'notes.html') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);


if (currentPageIndex ===  'notes.html') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();


// TODO: When clicking on the "Get Started" button, take the user to the /notes.html page.
// DONE 
// TODO: Fix Notes Page so that it renders correctly with the right elements. 
// DONE, there was an issue with the assets folders not linking correctly.
// TODO: Retrieve existing notes and display them on the left-hand side of the page. 
    // TODO: Build server.js file/code [DONE]
    // TODO: Figure out the routes needed on our app [DONE]
    // TODO: Figure out how to incorporate API code into index.js [DONE]

// TODO: Build out logic so save newly added note. 
  // TODO: When the user clicks on the save button, save the note as an entry of existing notes. [DONE]
  // TODO: Consume API request and add it to our json file. Reload the page or add this new note
  // TODO Continued: on the list of saved note entries. [DONE]

// TODO: Build out logic to delete note entries from database
  // TODO: Add a way to link the delete icon to the ID of our JSON payload. This will be passed to the
  // TODO Continued: delete API route to delete the existing note entry. We can reload the page after
  // TODO Continued: the entry has been deleted or handle it more gracefully. [DONE]
  // TODO: Add API Config to delete note entry. [DONE]

// TODO: Build out logic to show saved notes.
  // TODO: Build out logic that will render note entry onto the title field and the note context onto
  // TODO Continue: the note section. 
