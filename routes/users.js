const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// router.get("/", getUsers);
router.get("/:userId", auth, getUser);
router.patch("/me", auth, updateProfile);
// router.post("/", createUser);

module.exports = router;
