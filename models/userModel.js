const mongoose = require("mongoose");
const validator = require("validator");

const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
    minlength: [4, "Name must be at least 4 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validator: [validator.isEmail, "Invalid email"],
    // match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  // password: {
  //   type: String,
  //   required: [true, "Password is required"],
  //   minlength: [8, "Password must be at least 8 characters long"],
  // },
  avatar: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

userModel.plugin(plm);

module.exports = mongoose.model("User", userModel);
