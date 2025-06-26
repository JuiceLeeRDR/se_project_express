const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
// const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;
app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use(mainRouter);
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
