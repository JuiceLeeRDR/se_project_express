const ClothingItem = require("../models/clothingItems");
const {
  REQUEST_SUCCESS_CODE,
  CREATE_REQUEST_SUCCESS_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItem) => res.status(REQUEST_SUCCESS_CODE).send(clothingItem))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const createClothingItem = (req, res) => {
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
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  console.log("updateItem function called with itemId:", req.params.itemId);

  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESS_CODE).send(item))
    .catch((err) => {
      console.error("Full error object:", err);
      console.error("Error name:", err.name);
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESS_CODE).send({}))
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
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
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
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
