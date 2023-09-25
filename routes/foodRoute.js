const express = require('express');
const router = express.Router();
const foodPost = require("../model/foodPost");
const controller = require("../controllers/Controller");

router.get("", (req, res) => { 
    controller.getPosts(req, res, foodPost);
})

router.get("/:id", (req, res) => {
    controller.getPostDetails(req, res, foodPost);
})

router.post("/create", (req, res) => {
    controller.createSubmissions(req, res, "FOOD");
})

module.exports = router;