const router = require("express").Router();
const { getUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateProfileUpdate } = require("../middlewares/validation");

router.get("/me", auth, getUser);
router.patch("/me", auth, validateProfileUpdate, updateProfile);

module.exports = router;
