// const express = require("express");
// const router = express.Router();
// const { auth } = require("../../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/avatars/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });

// const filefilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: filefilter });

// const {
//   getContactsController,
//   getContactByIdController,
//   removeContactController,
//   createContactController,
//   updateContactController,
//   updateFavoriteContactController,
//   getAllUsersController,
//   createUserController,
//   loginUserController,
//   findUserController,
//   logOutController,
//   uploadAvatarController,
// } = require("../../controllers/index");

// // ************CONTACTS************
// router.get("/contacts", getContactsController);
// router.get("/contacts/:contactId", getContactByIdController);
// router.delete("/contacts/:contactId", removeContactController);
// router.post("/contacts", createContactController);
// router.put("/contacts/:contactId", auth, updateContactController);
// router.patch("/contacts/:contactId/favorite", auth, updateFavoriteContactController);

// //   ************USERS************
// router.get("/users", getAllUsersController);
// router.post("/users/signup", createUserController);
// router.post("/users/login", loginUserController);
// router.get("/users/current", auth, findUserController);
// router.get("/users/logout", auth, logOutController);
// router.patch("/users/avatar", auth, upload.single("avatar"), uploadAvatarController);

// module.exports = router;
