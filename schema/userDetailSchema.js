var mongoose = require("mongoose");
var Moment = require("moment");
var ObjectId = mongoose.Schema.Types.ObjectId;
var UserDetailSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "user"
    },
    nickName: {
        type: String,
        default: "新用户" + Date.now()
    },
    email: {
        value: String,
        secret: {
            type: Number,
            default: 0
        }
    },
    mobileNo: {
        value: Number,
        secret: {
            type: Number,
            default: 0
        }
    },
    age: {
        value: Number,
        secret: {
            type: Number,
            default: 0
        }
    },
    sex: {
        value: {
            type: Number,
            default: 0
        },
        secret: {
            type: Number,
            default: 0
        }
    },
    createTime: {
        type: String,
        default: Moment().format("YYYY-MM-DD HH:mm:ss")
    }
});

UserDetailSchema.statics = {
    fetch:function(callback){
        return this.find({}).populate("user").exec(callback);
    }
}



module.exports = UserDetailSchema;








