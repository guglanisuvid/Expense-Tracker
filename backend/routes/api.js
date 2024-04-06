const Joi = require("joi");
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const { generatePasswordHash } = require("../utils/hasher");

const userRegisterationValidationSchema = Joi.object({
  email: Joi.string().email().required().min(5),
  password: Joi.string().required().min(3).max(100),
  username: Joi.string().required(),
});

// Register new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const validationResults = userRegisterationValidationSchema.validate({
    email,
    password,
    username,
  });

  if (validationResults.error) {
    return res.json({
      error: true,
      message: validationResults.error || "Something went wrong",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existingUser) {
    const newUser = new User({
      email,
      password: generatePasswordHash(password),
      username,
    });

    newUser.save();

    req.logIn(newUser, (err) => {
      if (err) {
        return res.status(400).json({ error: true, message: err });
      } else {
        return res
          .status(201)
          .json({ error: false, message: "Sign up success" });
      }
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }
});

// Login user
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    error: false,
    message: "Login success",
  });
});

// Sign out user
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err)
      return res
        .status(500)
        .json({ error: true, message: err || "Something went wrong" });
    else
      return res.json({
        error: false,
        message: "User logged out successfully",
      });
  });
});

// Check current user authentication status
router.get("/is-authenticated", (req, res) => {
  if (req.isAuthenticated())
    return res.json({
      error: false,
      message: "User is Signed In",
      user: req.user,
    });
  else
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized access" });
});

module.exports = router;
