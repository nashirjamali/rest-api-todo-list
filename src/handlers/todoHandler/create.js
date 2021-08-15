const Validator = require("fastest-validator");
const moment = require("moment");
const { Todo } = require("../../models");

const v = new Validator();

module.exports = async (req, res) => {
  req.body.time = new Date(req.body.time);

  const validationRole = {
    name: "string|empty:false",
    description: "string",
    time: "date|empty:false",
  };

  const validate = v.validate(req.body, validationRole);

  if (validate.length) {
    return res.status(400).json({
      status: "Bad Request",
      message: validate,
    });
  }

  try {
    const { name, description, time } = req.body;

    const todo = await new Todo({
      name,
      description,
      time,
      userId: req.userId,
    }).save();

    return res.send({
      status: "Success",
      message: "Todo created!",
      data: {
        name: todo.name,
        description: todo.description,
        time: moment(todo.time).local().format("YYYY-MM-DD HH:mm:ss"),
        status: todo.status,
        createdAt: moment(todo.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};
