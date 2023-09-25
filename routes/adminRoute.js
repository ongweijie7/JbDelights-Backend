var jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const JsonResponse = require('../common/jsonResponse');

/* Modes */
const submissions = require("../model/submissions");
const fineDining = require("../model/fineDining");
const adventures = require("../model/adventures");
const foodPost = require("../model/foodPost");

//TODO: Separate into controller and
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
        .then((data) => {
            return JsonResponse.success(200, data).send(res);
        })
        .catch((error) => {
            console.log(error);
            return JsonResponse.fail(500, error).send(res);
        })
});

router.get("/:id", (req, res) => {
    const fetchData = async (id) => {
        try {
            const data = await submissions.findById(id);
            return JsonResponse.success(200, data).send(res);
        } catch (error) {
            console.log(error);
            return JsonResponse.fail(500, error).send(res);
        }
    }
    fetchData(req.params.id);
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
        return res.json(removedUser);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});


module.exports = router;