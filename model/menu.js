var MenuSchema = require("../schema/menuSchema");
var mongoose = require("mongoose");

var Menu = mongoose.model("menu", MenuSchema);

module.exports = Menu;