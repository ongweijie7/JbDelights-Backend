const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionsSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    images: {
        image1: { type: String, required: true },
        image2: { type: String },
    },
    details: { 
         openingHours : { type: String },
         introduction : { type: String, required: true },
    },
    address: {
        type: String,
    },
    tag: {
        type: String,
        required: true
    }
})

//parameters: Name of the model and the provided schema
const submissions = mongoose.model('Submissions', submissionsSchema); 
module.exports = submissions;