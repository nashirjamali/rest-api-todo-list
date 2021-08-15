const Validator = require("fastest-validator");
const moment = require("moment");
const mongoose = require("mongoose");
const { Todo } = require("../../models");

const v = new Validator();

module.exports = async (req, res) => {
  req.body.time = new Date(req.body.time);

  const validationRole = {
    params: {
      id: "string|empty:false",
    },
    body: {
      name: "string|empty:false",
      description: "string",
      time: "date|empty:false",
    },
  };

  const validate = {
    params: v.validate(req.params, validationRole.params),
    body: v.validate(req.body, validationRole.body),
  };

  if (validate.params.length || validate.body.length) {
    return res.status(400).json({
      status: "Bad Request",
      message: validate.body,
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

    const todo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
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
      message: "Todo updated!",
      data: {
        ...todo._doc,
        time: moment(todo.time).local().format("YYYY-MM-DD HH:mm:ss"),
        createdAt: moment(todo.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(todo.updatedAt).local().format("YYYY-MM-DD HH:mm:ss"),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};
