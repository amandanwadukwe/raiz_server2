const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contentSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    html:{
        type:String
    },
    date:{
        type:Date,
        required:true
    }
})

const Content = mongoose.model("content", contentSchema);
module.exports = Content;