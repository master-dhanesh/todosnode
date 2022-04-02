var express = require("express");
var router = express.Router();

const Todo = require("../models/todosModel");
const { isLoggedIn } = require("../middleware/auth");

/**
 * @desc show the registered todos
 * @route /todo/
 * @method GET
 * @access Public
 */
router.get("/", isLoggedIn, async (req, res, next) => {
  const todos = await Todo.find();
  res.json(todos);
});

/**
 * @desc Creates the todo
 * @route /todo/create
 * @method POST
 * @access Public
 */
router.post("/create", async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({
      message: "Please provide title and description",
    });
  }

  const todo = await Todo.create({
    title,
    description,
    owner: req.user._id,
  });

  req.user.todos.push(todo._id);
  await req.user.save();
});

module.exports = router;
