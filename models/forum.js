const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forumSchema = new Schema({
    sender:{
        type:String,
        required:true
    },
   sendersEmail:{
       type:String,
       required:true
   },
   recipientMessageId:{
       type:String,
       required:true
   },
   date:{
       type:Date,
       required:true
   },
    message:{
        type:String,
        required:true
    }
})

const Forum = mongoose.model("forum", forumSchema);
module.exports = Forum;