const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: 'Неверно введена ссылка на постер к фильму',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: 'Неверно введена ссылка на трейлер к фильму',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isUrl(v),
      message: 'Неверно введена ссылка на мини-постер к фильму',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('movie', movieSchema);
