var UserDetailSchema = require("../schema/userDetailSchema");
var mongoose = require("mongoose");

var UserDetail = mongoose.model("userDetail", UserDetailSchema, "user_detail");

module.exports = UserDetail;