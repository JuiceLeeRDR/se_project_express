const router = require("express").Router();
const auth = require("../middlewares/auth");

console.log("Clothing items router accessed");

const {
  getClothingItems,
  createClothingItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
