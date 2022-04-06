var express = require("express");
var router = express.Router();

const { isLoggedIn } = require("../middleware/auth");

const Todo = require("../models/todosModel");
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(User.authenticate()));

/**
 * @desc register page
 * @route /user/register
 * @method GET
 * @access Public
 */
router.get("/register", (req, res, next) => {
  res.render("register", { user: req.user });
});

/**
 * @desc login page
 * @route /user/login
 * @method GET
 * @access Public
 */
router.get("/login", (req, res, next) => {
  res.render("login", { user: req.user });
});

/**
 * @desc registers the user
 * @route /user/register
 * @method POST
 * @access Public
 */
router.post("/register", async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username,
  });

  User.register(user, req.body.password)
    .then((user) => {
      passport.authenticate("local")(req, res, () => {
        res.render("/user/login", { user: req.user });
      });
    })
    .catch((err) => res.send(err));
});

/**
 * @desc logins the user
 * @route /user/login
 * @method POST
 * @access Public
 */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
  }),
  (req, res, next) => {}
);

/**
 * @desc login page
 * @route /user/profile
 * @method GET
 * @access Authenticated
 */
router.get("/profile", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id)
    .populate("todos")
    .exec((err, user) => {
      if (err) return res.send(err);
      res.render("profile", { user: user });
    });
});

/**
 * @desc logouts the user
 * @route /user/logout
 * @method GET
 * @access Authenticated
 */
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect("/user/login");
});

module.exports = router;
