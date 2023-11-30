const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

const { nanoid } = require("nanoid");

const {
  getAllUsers,
  createUser,
  checkUserDB,
  findUser,
  logOutUser,
  verifyEmail,
} = require("../services/usersServices");
const { sendVerificationEmail } = require("../services/emailServices");

// ************UserControllers************
const getAllUsersController = async (req, res, next) => {
  try {
    const results = await getAllUsers();
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing required fields email or password",
      });
    }

    const result = await createUser({ email, password });

    const payload = { email: result.email };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    res.status(201).json({
      status: "Success",
      code: 201,
      data: { email: result.email, token },
    });
  } catch (error) {
    if (error.message === "This email already exists") {
      return res.status(409).json({
        status: "Conflict",
        code: 409,
        message: "Email in use",
      });
    }

    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server error",
    });
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "Validation error",
        code: 400,
        message: "Missing required fields email or password",
      });
    }

    const result = await checkUserDB({ email, password });
    const payload = { email: result.email };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    res.status(200).json({
      status: "Success",
      code: 200,
      data: { email: result.email, token, subscription: result.subscription },
    });
  } catch (error) {
    if (error.message === "Email or password is wrong") {
      return res.message(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    console.error(error);
    res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

const findUserController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing token",
      });
    }

    let tokenDecode;
    try {
      tokenDecode = jwt.verify(token, secret);
      console.log(tokenDecode);
    } catch (error) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid token",
        data: error.message,
      });
    }

    const result = await findUser({ email: tokenDecode.email });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: "Success",
        code: 200,
        data: {
          email: result.email,
          subscription: result.subscription,
          id: result._id,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not authorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

const logOutController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await logOutUser(userId);

    if (result.status === "Success") {
      res.status(204).json({
        status: "No content",
        code: 204,
        message: "User logged out successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

const uploadAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: "File not found" });
    }

    const uniqueFileName = `${req.user._id}-${Date.now()}${path.extname(req.file.originalname)}`;

    const destinationPath = path.join(__dirname, `../public/avatars/${uniqueFileName}`);

    await Jimp.read(req.file.path)
      .then((image) => {
        return image.resize(250, 250).quality(60).greyscale().writeAsync(destinationPath);
      })
      .then(() => {
        fs.unlinkSync(req.file.path);
      })
      .catch((error) => {
        throw error;
      });

    req.user.avatarURL = `avatars/${uniqueFileName}`;
    await req.user.save();

    res.status(200).json({
      status: "Success",
      code: 200,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
};

const verifyEmailController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    await verifyEmail(verificationToken);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: error.message,
    });
  }
};

const generateVerificationToken = () => {
  return nanoid();
};

const resendVerificationEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await findUser({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }
    console.log(`User verify status: ${user.verify}`);
    const verificationToken = await generateVerificationToken();
    console.log(`Generated verification token: ${verificationToken}`);
    user.verificationToken = verificationToken;
    await user.save();
    try {
      await sendVerificationEmail(verificationToken, email);
      console.log("Sent verification email");
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
    console.log(error);
  }
};

module.exports = {
  getAllUsersController,
  createUserController,
  loginUserController,
  findUserController,
  logOutController,
  uploadAvatarController,
  verifyEmailController,
  resendVerificationEmailController,
};
