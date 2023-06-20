const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
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

const FoodPosts = mongoose.model('FoodPosts', foodSchema);
module.exports = FoodPosts;