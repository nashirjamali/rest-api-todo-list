const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");

const { User } = require("../models");
const generateToken = require("../functions/generateToken");

const v = new Validator();

/**
 * Register Handler
 */
const register = async (req, res) => {
  const validationRole = {
    name: "string|empty:false",
    username: "string|empty:false",
    password: "string|empty:false",
  };

  const validate = v.validate(req.body, validationRole);

  if (validate.length) {
    return res.status(400).json({
      status: "Bad Request",
      message: validate,
    });
  }

  try {
    const { username, password, name } = req.body;

    let encryptPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      password: encryptPassword,
    });

    const savedUser = await user.save();

    let tokenHasGenerate = await generateToken(savedUser.id);
    return res.send({
      status: "Success",
      message: "User was registered successfully!",
      data: {
        name: user.name,
        username: user.username,
        token: tokenHasGenerate,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};

/**
 * Login Handler
 */
const login = async (req, res) => {
  const validationRole = {
    username: "string|empty:false",
    password: "string|empty:false",
  };

  const validate = v.validate(req.body, validationRole);

  if (validate.length) {
    return res.status(400).json({
      status: "Bad Request",
      message: validate,
    });
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username }).exec();

    if (!user) {
      return res.status(404).json({
        status: "Not Found.",
        message: "User not found",
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        status: "Error",
        message: "Password invalid",
      });
    }

    const tokenHasGenerate = await generateToken(user.id);

    return res.send({
      status: "Success",
      message: "User was login successfully!",
      data: {
        name: user.name,
        username: user.username,
        token: tokenHasGenerate,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};

module.exports = {
  register,
  login,
};
