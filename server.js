require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');



app.use(cors()); //allows for cross server interaction
app.use(express.json()); //gets any json request 

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("connect to db"))
    .catch((err) => console.log(err));



var login = require('./routes/login');
var localDelights = require('./routes/foodRoute');
var fineDining = require('./routes/fineDiningRoute');
var adventures = require('./routes/adventuresRoute');
var admin = require('./adminRoute');

app.use('/login', login);
app.use('/admin', admin);
app.use('/fineDining', fineDining);
app.use('/food', localDelights);
app.use('/adventures', adventures);
app.listen(process.env.PORT);
