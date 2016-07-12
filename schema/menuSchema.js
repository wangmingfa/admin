var mongoose = require("mongoose");
var MenuSchema = new mongoose.Schema({
    icon: String,
    text: String,
    isLeaf: Boolean,
    href: String,
    level: Number,
    fatherId: String,
    type: Number
});

/*MenuSchema.statics = {
    fetch:function(callback){
        return this.find({}).exec(callback);
    },
    find:function(args, callback){
        return this.find(args).exec(callback);
    }
}*/


module.exports = MenuSchema;