const express = require('express');
var app = express();
const mongoose = require("mongoose");
const cors = require('cors');


app.use(cors()); //allows for cross server interaction
app.use(express.json()); //gets any json request 

const uri = "mongodb+srv://ongweijie7:password169@cluster0.8iame0s.mongodb.net/JB-blog?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then((result) => console.log("connect to db"))
    .catch((err) => console.log(err));




var food = require('./routes/food-route');
app.use('/food', food);
app.listen(3000);
