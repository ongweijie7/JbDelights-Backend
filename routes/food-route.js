const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FoodPost = require("../model/food-post");
const { Schema } = mongoose;

router.get("", (req, res) => { 
    //retrieve all food posts
    FoodPost.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        })
})

//retrieve a particular food post
router.get("/:id", (req, res) => {
    const fetchData = async (id) => {
        try {
            const document = await FoodPost.findById(id);
            console.log(document);
            return document;
        } catch (error) {
            console.log(error);
        }
    }
    fetchData(req.params.id).then(result => res.send(result));   
})

router.post("/create", (req, res) => {
    const parsedBody = req.body;
    console.log(parsedBody);
    FoodPost.create(parsedBody).then(result => res.send("successfully added!")).catch(error => res.send("missing field u stupid"));

    
})

module.exports = router;