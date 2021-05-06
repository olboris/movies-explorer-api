const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-key' } = process.env;
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = new BadRequestError('Ошибка валидации');
      } else if (err.name === 'CastError') {
        error = new BadRequestError('Переданы некорректные данные');
      }
      next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = new BadRequestError('Ошибка валидации');
      } else if (err.name === 'CastError') {
        error = new BadRequestError('Переданы некорректные данные');
      }
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      User.findById(user._id).select('+password')
        .then(() => {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        });
    })
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = new BadRequestError('Ошибка валидации');
      } else if (err.name === 'CastError') {
        error = new BadRequestError('Переданы некорректные данные');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        error = new ConflictError('Пользователь с таким email уже существует');
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new AuthError('Неправильная почта или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password, ((error, isValid) => {
        if (error) {
          throw new AuthError('Неправильная почта или пароль');
        }
        if (isValid) {
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.send({ token });
        }
        if (!isValid) {
          return next(new AuthError('Неправильная почта или пароль'));
        }
        return undefined;
      }));
    })
    .catch(next);
};
