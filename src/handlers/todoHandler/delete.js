const Validator = require("fastest-validator");
const moment = require("moment");
const mongoose = require("mongoose");
const { Todo } = require("../../models");

const v = new Validator();

module.exports = async (req, res) => {
  const validationRole = {
    id: "string|empty:false",
  };

  const validate = v.validate(req.params, validationRole);

  if (validate.length) {
    return res.status(400).json({
      status: "Bad Request",
      message: validate,
    });
  }

  try {
    const { id } = req.params;

    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Id isn't valid",
      });
    }

    const todo = await Todo.findByIdAndDelete(id, {
      useFindAndModify: false,
    });

    if (!todo) {
      return res.status(404).json({
        status: "Not found.",
        message: "Todo not found",
      });
    }

    return res.send({
      status: "Success",
      message: "Todo deleted!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};
