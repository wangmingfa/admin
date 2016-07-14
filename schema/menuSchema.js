var mongoose = require("mongoose");
var MenuSchema = new mongoose.Schema({
    icon: String,
    text: String,
    isLeaf: Number,
    href: String,
    level: Number,
    fatherId: String,
    type: Number
});

MenuSchema.statics = {
    fetch: function(callback){
        return this.find({}).exec(callback);
    },
    getMenuById: function(id, callback){
        return this.findOne({_id: id}).exec(callback);
    }
}


module.exports = MenuSchema;