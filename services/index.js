// const Contact = require("./schemas/ContactSchema");
// const User = require("./schemas/UsersSchema");

// // ************CONTACTS************
// const getAllContacts = async () => {
//   return Contact.find();
// };

// const getContactById = async (id) => {
//   const contact = await Contact.findById(id);
//   return contact;
// };

// const removeContact = async (id) => {
//   const result = await Contact.findByIdAndDelete(id);
//   return result;
// };

// const createContact = async ({ name, email, phone, favorite, age }) => {
//   return Contact.create({ name, email, phone, favorite, age });
// };

// const updateContact = async (id, updateData) => {
//   const result = await Contact.findByIdAndUpdate({ _id: id }, updateData, { new: true });
//   return result;
// };

// const updateFavoriteContact = async (id, favoriteUpdate) => {
//   console.log(id, favoriteUpdate);
//   console.log(favoriteUpdate);
//   return Contact.findByIdAndUpdate({ _id: id }, { $set: favoriteUpdate }, { new: true });
// };

// // ************USERS************
// const getAllUsers = async () => {
//   return User.find();
// };

// const createUser = async ({ email, password }) => {
//   try {
//     const userExisting = await User.findOne({ email });
//     if (userExisting) {
//       throw new Error("This email is already in use");
//     }

//     const newUser = new User({ email, password });

//     newUser.setPassword(password);
//     newUser.generateAuthToken();
//     return await newUser.save();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const checkUserDB = async ({ email, password }) => {
//   try {
//     console.log(`Parola din checkUserDB:${password}`);
//     const user = await User.findOne({ email });
//     if (!user || !user.validPassword(password)) {
//       throw new Error("Email or password is wrong");
//     }
//     return user;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const findUser = async (user) => {
//   const result = await User.findOne({ email: user.email });
//   return result;
// };

// const logOutUser = async (userId) => {
//   console.log(`Logging out user with ID: ${userId}`);

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log(`User with ID: ${userId} not found`);
//       throw new Error("User not found");
//     }
//     user.tokens = [];
//     await user.save();

//     return {
//       status: "Success",
//       message: "User logged out successfully",
//     };
//   } catch (error) {
//     console.log(`Error logging out user with IDL ${userId}`);
//     return {
//       status: "Error",
//       message: error.message,
//     };
//   }
// };

// module.exports = {
//   // getAllContacts,
//   // getContactById,
//   // removeContact,
//   // createContact,
//   // updateContact,
//   // updateFavoriteContact,
//   getAllUsers,
//   createUser,
//   checkUserDB,
//   findUser,
//   logOutUser,
// };
