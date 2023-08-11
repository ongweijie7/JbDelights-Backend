const express = require('express');
const router = express.Router();
const users = require("../model/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fineDining = require("../model/fineDining");
const adventures = require("../model/adventures");
const foodPost = require("../model/foodPost");


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


router.post("/register", async (req, res) => { 
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);


    users.create({ email, password : hashedPassword})
    .then(result => res.status(201).json({ message: 'User registered successfully' }))
    .catch(error => res.status(500).json({ error: error }));
})

router.post("", (req, res) => { 
    const findUser = async (req) => {
        try {
            const { email, password } = req.body;
            const user = await users.findOne({ email });
            
            if (user == null) {
                return null;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return null;
            }

            const token = jwt.sign(
                { password: user.password, email: user.email, isAdmin: user.isAdmin },
                'your-secret-key', // Replace this with a long random string used for signing the token
                { expiresIn: '1h' } // Token expires in 1 hour
            );
            
            let favourites = Array.from(user.favourites, ([key, value]) => ({ key, value }));
            favourites = JSON.stringify(favourites);
            return { token, favourites };

        } catch (error) {
            console.log(error.message);
        }
    }

    findUser(req).then(({ token, favourites }) => {
        return token == null 
        ? res.status(404).json({error: "Wrong"}) 
        : res.status(200).json({token : token, favourites: favourites});
    })
})


router.get("/refresh", authUser, async (req, res) => {
    const email = req.user.email;
    const user = await users.findOne({ email });
    let favourites = Array.from(user.favourites, ([key, value]) => ({ key, value }));
    favourites = JSON.stringify(favourites);
    return res.status(200).json({favourites: favourites});
})

/* Retrieving liked posts which consists of posts from all categories*/

router.get("/favourites",  authUser, async (req, res) => {
    const email = req.user.email;
    const user = await users.findOne({ email });
    const hashtable = user.favourites;
    const posts = [];
    const keys = hashtable.keys()

    for (const key of keys) {
        let category = hashtable.get(key);

        switch (category){
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
        const postDetails = await collection.findOne({ "_id": key });
        posts.push(postDetails);
    }

    return res.status(200).json({ posts: posts });
})

/* Handle liking and unliking of posts */

router.post("/like", authUser, async (req, res) => {
    try {
        const { _id, category } = req.body;
        const { email } = req.user;

        // Find the user by email
        const user = await users.findOne({ email });

        // Add the new favorite item
        user.favourites.set(_id, category);

        // Save the changes
        await user.save();

        return res.json({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete("/unlike", authUser, async (req, res) => {
    try {
        const { _id } = req.body;
        const { email } = req.user;

        // Find the user by email
        const user = await users.findOne({ email });

        // Add the new favorite item
        user.favourites.delete(_id);

        // Save the changes
        await user.save();

        return res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

/* ******************************** */

module.exports = router;