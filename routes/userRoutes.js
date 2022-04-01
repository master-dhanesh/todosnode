var express = require("express");
var router = express.Router();

const User = require("../models/userModel");

/**
 * @desc Creates the todo
 * @route /user/create
 * @method POST
 * @access Public
 */
router.post("/create", async (req, res, next) => {});

module.exports = router;
