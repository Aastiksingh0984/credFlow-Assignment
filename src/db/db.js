const mongoose = require('mongoose');

const db = async ()=>{
    await mongoose.connect('mongodb+srv://Aastiksingh0984:AAStik27@cluster0.rpd4omz.mongodb.net/credFlow',{useNewUrlParser:true})
}

module.exports = {
    db
}