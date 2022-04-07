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
  res.render("show", { Todos: todos, user: req.user });
});

/**
 * @desc show the registered todos
 * @route /todo/create
 * @method GET
 * @access Public
 */
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("createtodo", { user: req.user });
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
  res.redirect("/user/profile");
});

/**
 * @desc deletes the todos
 * @route /todo/delete/:id
 * @method GET
 * @access Authenticated
 */
router.get("/delete/:id", isLoggedIn, async (req, res, next) => {
  await Todo.findByIdAndDelete(req.params.id);
  let todoIndex = req.user.todos.findIndex(
    (todo) => todo.toString() === req.params.id
  );
  req.user.todos.splice(todoIndex, 1);

  await req.user.save();
  res.redirect("/user/profile");
});

/**
 * @desc deletes the todos
 * @route /todo/update/:id
 * @method GET
 * @access Authenticated
 */
router.get("/update/:id", isLoggedIn, async (req, res, next) => {
  const data = await Todo.findById(req.params.id);
  res.render("update", { user: req.user, data });
});

/**
 * @desc deletes the todos
 * @route /todo/update/:id
 * @method POST
 * @access Authenticated
 */
router.post("/update/:id", isLoggedIn, async (req, res, next) => {
  const updatedData = { ...req.body };
  await Todo.findByIdAndUpdate(
    req.params.id,
    { $set: updatedData },
    { new: true }
  );
  res.redirect("/user/profile");
});

module.exports = router;
