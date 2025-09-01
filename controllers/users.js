const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  REQUEST_SUCCESS_CODE,
  CREATE_REQUEST_SUCCESS_CODE,
} = require("../utils/errors");

const { DefaultError } = require("../middlewares/errors/default-error");
const { BadRequestError } = require("../middlewares/errors/bad-request");
const { NotFoundError } = require("../middlewares/errors/not-found-request");
const {
  UnauthorizedError,
} = require("../middlewares/errors/unauthorized-request");
const { ConflictError } = require("../middlewares/errors/conflict-request");

const { JWT_SECRET } = require("../utils/config");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(CREATE_REQUEST_SUCCESS_CODE).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.code === 11000) {
        next(new ConflictError("Duplicate email error"));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(err.message));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(new DefaultError("An error has occurred on the server."));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(
          new UnauthorizedError("The email or password is incorrect")
        );
      }
      return next(new DefaultError("An error has occurred on the server."));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => res.status(REQUEST_SUCCESS_CODE).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(new DefaultError("An error has occurred on the server."));
    });
};

// module.exports = { createUser, getUser, login, updateProfile };
