const moment = require("moment");
const { Todo } = require("../../models");

module.exports = async (req, res) => {
  try {
    const perPage =
      typeof parseInt(req.query.per_page) === "number" && req.query.per_page
        ? parseInt(req.query.per_page)
        : 5;
    const page =
      typeof parseInt(req.query.page) === "number" && req.query.page
        ? parseInt(req.query.page)
        : 1;
    const q = req.query.q;
    const status = req.query.status;

    const todos = await Todo.find({
      $and: [
        { userId: req.userId },
        {
          $or: [
            q ? { name: { $regex: `.*${q}*.`, $options: "i" } } : {},
            q ? { description: { $regex: `.*${q}*.`, $options: "i" } } : {},
          ],
        },
        { ...(status ? { status } : "") },
      ],
    })
      .skip((page - 1) * (perPage - 1))
      .limit(perPage)
      .select(["_id", "name", "description", "time", "status"])
      .sort({ name: "asc" })
      .exec();

    const count = await Todo.countDocuments();
    const data = todos.map((todo) => {
      return {
        ...todo._doc,
        time: moment(todo.time).local().format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    return res.send({
      status: "Success",
      message: "Todos retrived!",
      page: page,
      per_page: perPage,
      count_data: count,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
};
