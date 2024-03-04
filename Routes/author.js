
const express = require('express');
const router = express.Router();
const AuthorsModel = require('../Models/AuthorsModel');


router.get('/all', async (req, res) => {
  try {
    const authors = await AuthorsModel.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/names', async (req, res) => {
  try {
    const authorNames = await AuthorsModel.find().distinct('name');
    res.json(authorNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/books', async (req, res) => {
  try {
    const authorsBooksCount = await AuthorsModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'books'
        }
      },
      {
        $project: {
          name: 1,
          numberOfBooks: { $size: '$books' }
        }
      }
    ]);
    res.json(authorsBooksCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Le nom de l\'auteur est requis.' });
  }

  try {
    const newAuthor = new AuthorsModel({ name });
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:name', async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: 'Le nouveau nom de l\'auteur est requis.' });
  }

  try {
    const author = await AuthorsModel.findOne({ name });
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    author.name = newName;
    await author.save();

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const deletedAuthor = await AuthorsModel.findOneAndDelete({ name });

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    res.json(deletedAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
