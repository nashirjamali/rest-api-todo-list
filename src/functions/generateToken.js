const jwt = require("jsonwebtoken");

module.exports = async (id) => {
  const secretKey = process.env.JWT_TOKEN || "secret";
  const token = jwt.sign({ id: id }, secretKey);
  return token;
};
