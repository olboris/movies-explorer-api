const NotFoundError = require('../errors/not-found-error');

module.exports.notFound = (req, res, next) => {
  Promise.reject(new NotFoundError('Запрашиваемый ресурс не найден')).catch(next);
};
