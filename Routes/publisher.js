const express = require('express');
const router = express.Router();
const PublishersModel = require('../Models/PublishersModel');

router.get('/all', async (req, res) => {
  try {
    const publishers = await PublishersModel.find();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/names', async (req, res) => {
  try {
    const publisherNames = await PublishersModel.find().distinct('name');
    res.json(publisherNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/publishers', async (req, res) => {
  try {
    const publisherBooksCount = await PublishersModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'publisher',
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
    res.json(publisherBooksCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Le nom de l\'éditeur est requis.' });
  }

  try {
    const newPublisher = new PublishersModel({ name });
    await newPublisher.save();
    res.status(201).json(newPublisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:name', async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: 'Le nouveau nom de l\'éditeur est requis.' });
  }

  try {
    const publisher = await PublishersModel.findOne({ name });
    if (!publisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé.' });
    }

    publisher.name = newName;
    await publisher.save();

    res.json(publisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const deletedPublisher = await PublishersModel.findOneAndDelete({ name });

    if (!deletedPublisher) {
      return res.status(404).json({ message: 'Éditeur non trouvé.' });
    }

    res.json(deletedPublisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
