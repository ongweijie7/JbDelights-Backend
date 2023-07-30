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



var login = require('./routes/login');
var localDelights = require('./routes/foodRoute');
var fineDining = require('./routes/fineDiningRoute');
var adventures = require('./routes/adventuresRoute');
app.use('/login', login);
app.use('/fineDining', fineDining);
app.use('/food', localDelights);
app.use('/adventures', adventures);
app.listen(3000);
