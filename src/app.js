const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

const path = require("path");

dotenv.config();

require("./middleware/passportConfig.js");

const contactsRouter = require("./routes/api/contactsRoute.js");
const usersRouter = require("./routes/api/usersRoute.js");
const coreOptions = require("./cors");

const app = express();

app.use(morgan("tiny"));
app.use(cors(coreOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public/avatars")));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use("/contacts", contactsRouter);
app.use("/users", usersRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
    data: "Not found!",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server error!",
  });
});

const PORT = process.env.PORT_SERVER || 5000;
const URL_DB = process.env.DB_URL;

mongoose
  .connect(URL_DB)
  .then(() => {
    console.log("MongoDB server is running");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server is not running.Error:${err.message}`);
  });
module.exports = app;
