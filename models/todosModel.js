const mogoose = require("mongoose");

const todosModel = new mogoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [4, "Name must be at least 4 characters long"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [4, "Name must be at least 4 characters long"],
    },
    status: {
      type: "String",
      default: "pending",
    },
    owner: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mogoose.model("Todo", todosModel);
