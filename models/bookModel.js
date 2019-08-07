const mongoose = require('mongoose');

//pulls the schema out of mongoose, this is a cleaner approach as it requires less consistent code maintence. 
const { Schema } = mongoose;
const bookModel = new Schema({
    author: { type:String },
    country: { type:String },
    imageLink: { type:String },
    language: { type:String },
    link: { type:String },
    pages: { type:String },
    title: { type:String },
    year: { type:String },
    read: { type:Boolean, default: false }
});

module.exports = mongoose.model('Book', bookModel);