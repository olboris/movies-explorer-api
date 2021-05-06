const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (isUrl(value)) {
        return value;
      }
      return helper.message('Неверно введена ссылка на постер к фильму');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (isUrl(value)) {
        return value;
      }
      return helper.message('Неверно введена ссылка на трейлер к фильму');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (isUrl(value)) {
        return value;
      }
      return helper.message('Неверно введена ссылка на мини-постер к фильму');
    }),
    movieId: Joi.string().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
