const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    avatar:{
        type: String,
        require:true
    },
    date:{
        type:Date,
        required:true
    },
    messages:{
        type:Array,
        "default" : []
    }
})

const User = mongoose.model("user", userSchema);
module.exports = User;