var express = require("express");
var router = express.Router();

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
router.get("/register", async (req, res, next) => {
  res.render("register");
});

/**
 * @desc login page
 * @route /user/login
 * @method GET
 * @access Public
 */
router.get("/login", async (req, res, next) => {
  res.render("login");
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
        res.json({
          message: "User created successfully",
          user: user,
        });
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
    successRedirect: "/todo",
    failureRedirect: "/login",
  }),
  (req, res, next) => {}
);

/**
 * @desc logouts the user
 * @route /user/logout
 * @method GER
 * @access Public
 */
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/user/login");
});

module.exports = router;
