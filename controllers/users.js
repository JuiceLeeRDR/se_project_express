const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  REQUEST_SUCCESS_CODE,
  CREATE_REQUEST_SUCCESS_CODE,
} = require("../utils/errors");

const { DefaultError } = require("../middlewares/errors/error-handler");
const BadRequestError = require("../middlewares/errors/bad-request");
const NotFoundError = require("../middlewares/errors/not-found-request");
const UnauthorizedError = require("../middlewares/errors/unauthorized-request");
const ConflictError = require("../middlewares/errors/conflict-request");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
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
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.code === 11000) {
        next(new ConflictError("Duplicate email error"));
      } else {
        next(err);
      }
    });
  // .catch((err) => {
  //   console.error(err);
  //   if (err.code === 11000) {
  //     return res
  //       .status(ConflictError)
  //       .send({ message: "A conflict has occurred" });
  //   }
  //   if (err.name === "ValidationError") {
  //     return res.status(BadRequestError).send({ message: "Invalid data." });
  //   }
  //   return res
  //     .status(DefaultError)
  //     .send({ message: "An error has occurred on the server." });
  // });
};

const getUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_SUCCESS_CODE).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data." });
      }
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BadRequestError)
      .send({ message: "The password and email fields are required" });
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
        return res
          .status(UnauthorizedError)
          .send({ message: "The email or password is incorrect" });
      }
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => res.status(REQUEST_SUCCESS_CODE).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data." });
      }
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { createUser, getUser, login, updateProfile };
