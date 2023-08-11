var jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const submissions = require("../model/submissions");
const fineDining = require("../model/fineDining");
const adventures = require("../model/adventures");
const foodPost = require("../model/foodPost");

const authAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorisation.split(" ")[1];  // Get token from header
        var decoded;
        try {
            decoded = jwt.verify(token, 'your-secret-key');
        } catch (error) {
            console.log(error);
        }
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Admin access denied" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
}

router.get('/submissions', authAdmin, (req, res) => {
    submissions.find()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        })
});

router.get("/:id", (req, res) => {
    const fetchData = async (id) => {
        try {
            const document = await submissions.findById(id);
            return document;
        } catch (error) {
            console.log(error);
        }
    }
    fetchData(req.params.id).then(result => res.send(result));   
})

/* Adds submissions to the relevant collections or rejects them*/
router.post('/:id', authAdmin, (req, res) => {
    const submission = req.body;
    const { _id, ...withoutIdObject } = submission;

    let collection;
    switch(submission.tag) {
    case "FOOD":
        collection = foodPost;
        break;
    case "FINE_DINING":
        collection = fineDining;
        break;
    case "ADVENTURES":
        collection = adventures;
        break;
    }

    collection.create(withoutIdObject)
    .then(result => res.json({text: "successfully added!"}))
    .catch(error => res.json({text: error}));
});

router.delete('/:id', authAdmin, async (req, res) => {
    console.log(req.params.id);
    try {
        const removedUser = await submissions.findByIdAndRemove(req.params.id) ;
        res.json(removedUser);
    } catch (err) {
    res.status(400).json({ message: err });
    }
});


module.exports = router;