const User = require("../models/user");
const {
  REQUEST_SUCCESS_CODE,
  CREATE_REQUEST_SUCCESS_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  console.log("IN CTRLR");
  User.find({})
    .then((users) => res.status(REQUEST_SUCCESS_CODE).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATE_REQUEST_SUCCESS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_SUCCESS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
