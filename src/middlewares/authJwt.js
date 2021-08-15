const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const secretKey = process.env.JWT_TOKEN || "secret";

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "Failed",
      message: "No token provided!",
    });
  }

  let token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      status: "Failed",
      message: "No token provided!",
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "Failed",
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken,
};
