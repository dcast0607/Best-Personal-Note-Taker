// Immediately export a function that generates a string of random numbers and letters

// The purpose of this function is to generate a random number so that it can be used
// as an ID that is linked to our note. In addition to this, the ID that is generated
// from this uuid.js will be used to validate existing notes.
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);