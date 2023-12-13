const Contact = require("./schemas/ContactSchema");

// ************CONTACTS************
const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

const removeContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const createContact = async ({ name, email, phone, favorite, age }) => {
  return Contact.create({ name, email, phone, favorite, age });
};

const updateContact = async (id, updateData) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, updateData, { new: true });
  return result;
};

const updateFavoriteContact = async (id, favoriteUpdate) => {
  console.log(id, favoriteUpdate);
  console.log(favoriteUpdate);
  return Contact.findByIdAndUpdate({ _id: id }, { $set: favoriteUpdate }, { new: true });
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
  updateFavoriteContact,
};
