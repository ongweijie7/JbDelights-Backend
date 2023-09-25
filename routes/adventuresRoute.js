const express = require('express');
const router = express.Router();
const adventures = require("../model/adventures");
const controller = require("../controllers/Controller");

router.get("", (req, res) => { 
    controller.getPosts(req, res, adventures);
})

router.get("/:id", (req, res) => {
    controller.getPostDetails(req, res, adventures);
})

router.post("/create", (req, res) => {
    controller.createSubmissions(req, res, "ADVENTURES");
})

module.exports = router;