var express = require("express");
var router = express.Router();

const { isLoggedIn } = require("../middleware/auth");

const Todo = require("../models/todosModel");
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

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

/**
 * @desc logouts the user
 * @route /user/forgot
 * @method GET
 * @access Public
 */
router.get("/forgot", isLoggedIn, (req, res, next) => {
  res.render("forgot", { user: null });
});

/**
 * @desc logouts the user
 * @route /user/forgot
 * @method POST
 * @access Public
 */
router.post("/forgot", isLoggedIn, async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.send("Passwords do not match. <a href='/user/forgot'>Back</a>");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.send("No user found with that email");
  }

  user.setPassword(password, async (err) => {
    if (err) return res.send(err);
    await user.save();
    res.redirect("/user/login");
  });
});

/**
 * @desc logouts the user
 * @route /user/reset
 * @method GET
 * @access Public
 */
router.get("/reset", isLoggedIn, async (req, res, next) => {
  res.render("reset", { user: null });
});

/**
 * @desc logouts the user
 * @route /user/reset
 * @method POST
 * @access Public
 */
router.post("/reset", isLoggedIn, async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  if (oldpassword === newpassword) {
    res.send(
      "New password cannot be the same as the old password.<a href='/user/forgot'>Back</a>"
    );
  }

  req.user.changePassword(oldpassword, newpassword, async (err) => {
    if (err) return res.send(err);
    await req.user.save();
    res.redirect("/user/login");
  });
});

module.exports = router;
