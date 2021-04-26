const db = require("../models/db.js");
const Tutorial = db.tutorial;

const Comment = db.comment;

const { Op } = require("sequelize")
// Display list of all tutorials