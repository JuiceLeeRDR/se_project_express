const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateCardBody, createClothingItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
