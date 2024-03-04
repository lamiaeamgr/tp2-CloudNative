const express = require('express');
const router = express.Router();
const BooksModel = require('../Models/BooksModel');
const AuthorsModel = require('../Models/AuthorsModel');
const PublishersModel = require('../Models/PublishersModel');


router.get('/all', async (req, res) => {
  try {
    const books = await BooksModel.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/authors/:livrename', async (req, res) => {
  const { livrename } = req.params;

  try {
    const authorsInfo = await BooksModel.find({ title: livrename })
      .populate('author', 'name');

    res.json(authorsInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/publishers/:livrename', async (req, res) => {
  const { livrename } = req.params;

  try {
    const publishersInfo = await BooksModel.find({ title: livrename })
      .populate('publisher', 'name');

    res.json(publishersInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/listCategorie/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const booksByCategory = await BooksModel.find({ category });
    res.json(booksByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:annee1/:annee2', async (req, res) => {
  const { annee1, annee2 } = req.params;

  try {
    const booksBetweenYears = await BooksModel.find({
      releaseYear: { $gte: annee1, $lte: annee2 }
    });
    res.json(booksBetweenYears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
  const { title, authorName, publisherName, category, releaseYear } = req.body;

  if (!title || !authorName || !publisherName || !category || !releaseYear) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const author = await AuthorsModel.findOne({ name: authorName });
    const publisher = await PublishersModel.findOne({ name: publisherName });

    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    if (!publisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé.' });
    }

    const newBook = new BooksModel({
      title,
      author: author._id,
      publisher: publisher._id,
      category,
      releaseYear
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:title', async (req, res) => {
  const { title } = req.params;
  const { newTitle, newAuthorName, newPublisherName, newCategory, newReleaseYear } = req.body;

  if (!newTitle || !newAuthorName || !newPublisherName || !newCategory || !newReleaseYear) {
    return res.status(400).json({ message: 'Tous les champs sont requis pour la mise à jour.' });
  }

  try {
    const book = await BooksModel.findOne({ title });

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    const author = await AuthorsModel.findOne({ name: newAuthorName });
    const publisher = await PublishersModel.findOne({ name: newPublisherName });

    if (!author) {
      return res.status(404).json({ message: 'Nouvel auteur non trouvé.' });
    }

    if (!publisher) {
      return res.status(404).json({ message: 'Nouvel éditeur non trouvé.' });
    }

    book.title = newTitle;
    book.author = author._id;
    book.publisher = publisher._id;
    book.category = newCategory;
    book.releaseYear = newReleaseYear;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const deletedBook = await BooksModel.findOneAndDelete({ title });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
