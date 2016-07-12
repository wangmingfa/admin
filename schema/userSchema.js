var mongoose = require("mongoose");
var db = require("mongodb");
var Bcrypt = require("bcrypt-nodejs");
var SALT = Bcrypt.genSaltSync(10);
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.statics = {
    fetch:function(callback){
        return this.find({}).exec(callback);
    },
    signIn:function(user, callback){
        return this.findOne({username: user.username}).exec(function(err, result){
            if(err) callback(err);
            if(!result) return callback({message: "用户名不存在"});
            var isCrect = Bcrypt.compareSync(user.password, result.password);
            if(!isCrect) return callback({message: "密码错误"});
            callback(null, result);
        });
    }/*,
    find:function(args, callback){
        return this.find(args).exec(callback);
    }*/
 }



module.exports = UserSchema;