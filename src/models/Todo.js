"use strict";
const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "unchecked",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Todo",
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", TodoSchema);
