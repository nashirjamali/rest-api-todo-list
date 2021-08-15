const express = require("express");
const verifySignUp = require("../middlewares/verifySignUp");
const router = express.Router();

const userHandler = require("../handlers/userHandler");

router.post("/register", verifySignUp, userHandler.register);
router.post("/login", userHandler.login);

module.exports = router;
