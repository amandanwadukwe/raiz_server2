const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})

const Notice = mongoose.model("notice", noticeSchema);
module.exports = Notice;