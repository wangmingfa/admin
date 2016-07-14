var mongoose = require("mongoose");
var Bcrypt = require("bcrypt-nodejs");
var ObjectId = mongoose.Schema.Types.ObjectId;
var SALT = Bcrypt.genSaltSync(10);
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    detail: {
        type: ObjectId,
        ref: "userDetail"
    },
    status: {
        type: Number,
        default: 0
    }
});

UserSchema.pre("save", function(next){
    this.password = Bcrypt.hashSync(this.password, SALT);
    next();
});

UserSchema.statics = {
    fetch: function(callback){
        return this.find({}).populate("detail").exec(callback);
    },
    getUserById: function(id, callback){
        return this.findOne({_id: id}).exec(callback);
    },
    getUserByName: function(username, callback){
        return this.findOne({username: username}).exec(callback);
    },
    signIn: function(user, callback){
        return this.findOne({username: user.username}).exec(function(err, result){
            if(err) callback(err);
            if(!result) return callback({message: "用户名不存在"});
            var isCorrect = Bcrypt.compareSync(user.password, result.password);
            if(!isCorrect) return callback({message: "密码错误"});

            if(result.status != 1){
                var message = "";
                switch(result.status){
                    case 0:
                        message = "账号未激活";
                        break;
                    case 2:
                        message = "账号被锁定";
                        break;
                    case 3:
                        message = "账号被冻结";
                        break;
                    default:
                        message = "账号异常";
                        break;
                }
                return callback({message: message});
            }
            callback(null, result);
        });
    }
 }



module.exports = UserSchema;