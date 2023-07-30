var jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const submissions = require("../model/submissions");

const authAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorisation.split(" ")[1];  // Get token from header
        console.log(token);
        var decoded;
        try {
            decoded = jwt.verify(token, 'your-secret-key');
            console.log(decoded);
        } catch (error) {
            console.log(error);
        }
        
        
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Admin access denied" });
        }
        console.log(decoded);
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
            console.log("Correct one");
            const document = await submissions.findById(id);
            return document;
        } catch (error) {
            console.log(error);
        }
    }
    fetchData(req.params.id).then(result => res.send(result));   
})

router.delete('/id', authAdmin, (req, res) => {
    // Admin only data here...
    
});

router.post('/id', authAdmin, (req, res) => {
    // Admin only data here...
    
});


module.exports = router;