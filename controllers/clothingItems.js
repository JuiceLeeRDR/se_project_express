const ClothingItem = require("../models/clothingItems");
const {
  REQUEST_SUCCESS_CODE,
  CREATE_REQUEST_SUCCESS_CODE,
} = require("../utils/errors");
const { DefaultError } = require("../middlewares/errors/error-handler");
const BadRequestError = require("../middlewares/errors/bad-request");
const ForbiddenError = require("../middlewares/errors/forbidden-request");
const NotFoundError = require("../middlewares/errors/not-found-request");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItem) => res.status(REQUEST_SUCCESS_CODE).send(clothingItem))
    .catch((err) => {
      console.error(err);
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

const createClothingItem = (req, res) => {
  console.log("req.user:", req.user);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    createdAt: Date.now(),
  })
    .then((item) => res.status(CREATE_REQUEST_SUCCESS_CODE).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data." });
      }
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(ForbiddenError)
          .send({ message: "You can only delete your own items." });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(REQUEST_SUCCESS_CODE).send(deletedItem)
      );
    })
    .catch((err) => {
      console.error(err);
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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESS_CODE).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid item ID" });
      }
      return res
        .status(DefaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESS_CODE).send(item))
    .catch((err) => {
      console.error(err);
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

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
