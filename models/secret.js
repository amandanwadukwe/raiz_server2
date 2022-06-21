const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const secretSchema = new Schema({
    secret:{
        type:String,
        required:true
    },
})

const Secret = mongoose.model("secret", secretSchema);
module.exports = Secret;