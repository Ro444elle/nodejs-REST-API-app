const express = require("express");
const router = express.Router();

const { auth } = require("../../middleware/auth");

const {
  getContactsController,
  getContactByIdController,
  removeContactController,
  createContactController,
  updateContactController,
  updateFavoriteContactController,
} = require("../../controllers/contactsControllers");

// ************CONTACTS************
router.get("/", getContactsController);
router.get("/:contactId", getContactByIdController);
router.delete("/:contactId", removeContactController);
router.post("/", createContactController);
router.put("/:contactId", auth, updateContactController);
router.patch("/:contactId/favorite", auth, updateFavoriteContactController);

module.exports = router;
