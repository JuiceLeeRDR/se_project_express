const router = require("express").Router();
const { getUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserInfo } = require("../middlewares/validation");

router.get("/me", auth, getUser);
router.patch("/me", auth, validateUserInfo, updateProfile);

module.exports = router;
