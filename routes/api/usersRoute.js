const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

const {
  getAllUsersController,
  createUserController,
  loginUserController,
  findUserController,
  logOutController,
  uploadAvatarController,
} = require("../../controllers/userControllers");

//   ************USERS************
router.get("/", getAllUsersController);
router.post("/signup", createUserController);
router.post("/login", loginUserController);
router.get("/current", auth, findUserController);
router.get("/logout", auth, logOutController);
router.patch("/avatar", auth, upload.single("avatar"), uploadAvatarController);

module.exports = router;
