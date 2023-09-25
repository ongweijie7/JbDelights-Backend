const express = require('express');
const router = express.Router();
const fineDining = require("../model/fineDining");
const controller = require("../controllers/Controller");

router.get("", (req, res) => { 
    controller.getPosts(req, res, fineDining);
})

router.get("/:id", (req, res) => {
    controller.getPostDetails(req, res, fineDining);  
})

router.post("/create", (req, res) => {
    controller.createSubmissions(req, res, "FINEDINING");
})

module.exports = router;