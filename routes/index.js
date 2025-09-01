const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NotFoundError } = require("../middlewares/errors/not-found-request");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found."));
});

module.exports = router;
