const uuid = require('./helpers/uuid');

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