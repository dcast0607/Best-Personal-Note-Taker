// We import the uuid helper file, we will use this in our notes object definition. 

const uuid = require('./helpers/uuid');

// We initialize a few test entries that we can use to seed data. 
const notes = [
    {
        title: 'Test Title',
        text: 'Test text',
        note_id: uuid(),
    },
    {
        title: 'Test Note 1',
        text: 'Test text 1',
        note_id: uuid(),
    },
    {
        title: 'Test Note 2',
        text: 'Test text',
        note_id: uuid(),
    }
];

module.exports = notes;