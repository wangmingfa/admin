var UserSchema = require("../schema/userSchema");
var mongoose = require("mongoose");

var User = mongoose.model("user", UserSchema, "user");

module.exports = User;