const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        reuqired:true
    },
    password:{
        type: String,
        reuqired: true
    }
})

module.exports = mongoose.model('user', UserSchema);