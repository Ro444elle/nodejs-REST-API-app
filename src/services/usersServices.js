// import { nanoid } from "nanoid";

const User = require("./schemas/UsersSchema");
// const sgMail = require("@sendgrid/mail");
const { sendVerificationEmail } = require("./emailServices");

let nanoid;
import("nanoid").then((module) => {
  nanoid = module.nanoid;
});
// ************USERS************

const getAllUsers = async () => {
  return User.find();
};

const createUser = async ({ email, password }) => {
  try {
    const userExisting = await User.findOne({ email });
    if (userExisting) {
      throw new Error("This email is already in use");
    }

    const uniqueCodeVerify = nanoid();

    await sendVerificationEmail(email, uniqueCodeVerify);

    const newUser = new User({ email, password, verificationToken: uniqueCodeVerify });
    newUser.setPassword(password);
    newUser.generateAuthToken();
    return await newUser.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkUserDB = async ({ email, password }) => {
  try {
    console.log(`Parola din checkUserDB:${password}`);
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      throw new Error("Email or password is wrong");
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

const findUser = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

const logOutUser = async (userId) => {
  console.log(`Logging out user with ID: ${userId}`);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User with ID: ${userId} not found`);
      throw new Error("User not found");
    }
    user.tokens = [];
    await user.save();

    return {
      status: "Success",
      message: "User logged out successfully",
    };
  } catch (error) {
    console.log(`Error logging out user with IDL ${userId}`);
    return {
      status: "Error",
      message: error.message,
    };
  }
};

const verifyEmail = async (verificationToken) => {
  const update = { verify: true, verificationToken: null };

  const result = await User.findOneAndUpdate(
    {
      verificationToken,
    },
    { $set: update },
    { new: true }
  );
  console.log(result);
  if (!result) {
    throw new Error("User not found");
  }
};

module.exports = {
  getAllUsers,
  createUser,
  checkUserDB,
  findUser,
  logOutUser,
  verifyEmail,
};
