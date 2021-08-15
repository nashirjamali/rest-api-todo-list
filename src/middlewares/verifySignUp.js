const { User } = require("../models");

const verifySignUp = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        status: "Failed",
        message: "Something went wrong",
        debug: err,
      });
      return;
    }

    if (user) {
      res.status(400).send({
        status: "Failed",
        message: "Username already used",
      });
      return;
    }

    next();
  });
};

module.exports = verifySignUp;
