var MenuSchema = require("../schema/menuSchema");
var mongoose = require("mongoose");

var Menu = mongoose.model("menu", MenuSchema, "menu");

module.exports = Menu;