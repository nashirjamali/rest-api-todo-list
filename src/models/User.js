"use strict";
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
