"use strict";

require("env2")(".env");

const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./src/routes/user");
const todoRoute = require("./src/routes/todo");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/todo", todoRoute);

module.exports = app;
