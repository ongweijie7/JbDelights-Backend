const express = require('express');
const router = express.Router();
const foodPost = require("../model/foodPost");
const submissions = require("../model/submissions");

router.get("", (req, res) => { 
    //retrieve all food posts
    foodPost.find()
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
            const document = await foodPost.findById(id);
            return document;
        } catch (error) {
            console.log(error);
        }
    }
    fetchData(req.params.id).then(result => res.send(result));   
})

router.post("/create", (req, res) => {
    const parsedBody = req.body;
    parsedBody.tag = "FOOD";
    submissions.create(parsedBody)
    .then(result => res.json({text: "successfully added!"}))
    .catch(error => res.json({text: error}));
})

module.exports = router;