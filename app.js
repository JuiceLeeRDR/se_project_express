require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { ErrorHandler } = require("./middlewares/errors/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const { validateUserInfo, validateLogIn } = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;
app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.post("/signin", validateLogIn, login);
app.post("/signup", validateUserInfo, createUser);

app.use(mainRouter);
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(errorLogger);
app.use(errors());
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
