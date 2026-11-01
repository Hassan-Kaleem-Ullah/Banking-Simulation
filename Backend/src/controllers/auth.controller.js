const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

/* POST /api/auth/register */
/* POST User Register Controller */

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isExists = await userModel.findOne({
    $or: [{ email, username }],
  });

  if (isExists) {
    return res.status(409).json({
      msg: "User already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const token = jwt.sign(
    {
      userid: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    msg: "User registered successfully",
  });

  await emailService.sendRegistrationEmail(user.email, user.username);
  
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  const user = await userModel
    .findOne({
      username,
    })
    .select("+password");

  if (!user) {
    return res.status(404).json({
      msg: "User not found",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      msg: "Invalid credentials",
    });
  }
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    msg: "User logged in successfully",
  });
}

module.exports = { registerUser, loginUser };
