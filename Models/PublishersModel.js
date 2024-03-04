
const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const PublishersModel = mongoose.model('Publisher', publisherSchema);

module.exports = PublishersModel;
