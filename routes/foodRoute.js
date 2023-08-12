const express = require('express');
const router = express.Router();
const foodPost = require("../model/foodPost");
const submissions = require("../model/submissions");
const User = require("../model/user");
const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    try {
        const token = req.headers.authorisation.split(" ")[1];  // Get token from header
        var decoded;
        try {
            decoded = jwt.verify(token, 'your-secret-key');
        } catch (error) {
            console.log(error);
            return res.status(402).json({ message: "Authentication token has expired. Please log in again." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
}

router.get("", (req, res) => { 
    //retrieve all food posts
    foodPost.find()
        .then((result) => {
            res.json({ posts: result });
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
    .catch(error => res.status(400));
})

module.exports = router;