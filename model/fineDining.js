const mongoose = require('mongoose');
const { Schema } = mongoose;

const fineDiningSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    images: {
        image1: {type: String, required: true},
        image2: {type: String },
    },
    details: { 
         openingHours : { type: String, required: true } ,
         introduction : { type: String, required: true } ,
    },
    hook: {
        type: String,
    },
    address: {
        type: String,
    }
    
})

//parameters: Name of the model and the provided schema
const FineDiningPosts = mongoose.model('FineDiningPosts', fineDiningSchema); 
module.exports = FineDiningPosts;