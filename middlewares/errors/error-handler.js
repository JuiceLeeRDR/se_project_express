const jwt = require("jsonwebtoken");

module.exports.BadRequestError = (err, res) => {
  res.status(err.statusCode).send({
    message: statusCode === 400 ? "A bad request to server" : err.message,
  });
};
module.exports.UnauthorizedError = (err, res) => {
  res.status(err.statusCode).send({
    message:
      statusCode === 401 ? "Unauthorized request to server" : err.message,
  });
};
module.exports.ForbiddenError = (err, res) => {
  res.status(err.statusCode).send({
    message: statusCode === 403 ? "Forbidden request" : err.message,
  });
};
module.exports.NotFoundError = (err, res) => {
  res.status(err.statusCode).send({
    message: statusCode === 404 ? "Not found" : err.message,
  });
};
module.exports.ConflictError = (err, res) => {
  res.status(err.statusCode).send({
    message:
      statusCode === 409 ? "There's a conflict on the server" : err.message,
  });
};

module.exports.ErrorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    message:
      statusCode === 500 ? "An error occured on the server" : err.message,
  });
};
