
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  category: { type: String },
  releaseYear: { type: Number },
  
});

const BooksModel = mongoose.model('Book', bookSchema);

module.exports = BooksModel;
