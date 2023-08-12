const express = require('express');
const router = express.Router();
const users = require("../model/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fineDining = require("../model/fineDining");
const adventures = require("../model/adventures");
const foodPost = require("../model/foodPost");
const { ValidationError } = require("../errors/Errors");

/* Middleware functions */
const authUser = (req, res, next) => {
    try {
        const token = req.headers.authorisation.split(" ")[1];  // Get token from header
        var decoded;
        try {
            decoded = jwt.verify(token, 'your-secret-key');
        } catch (error) {
            console.log(error);
            return res.status(402).json({ error: "Authentication token has expired. Please log in again." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
}

const validateRegistration = async (req, res, next) => {
    const emailRegex = /^[A-z0-9]+@[A-z]+\.[A-z]{2,4}$/;
    const passwordRegex = /^(?=.*[A-z])(?=.*\d)[A-z\d]{8,}$/;
    const { email, password } = req.body;
    try  {
        if (!emailRegex.test(email)) {
            console.log("400 Invalid email address provided");
            throw new ValidationError("Please provide a valid email address", 400);
        } else if (!passwordRegex.test(password)) {
            console.log("400 Password provided does not follow the provided guidelines");
            throw new ValidationError("Please provide an alphanumeric password with at least 8 characters", 400);
        }
    
        const user = await users.findOne({ email });
        if (user != null) {
            console.log("409 There is currently another user associated with the provided email");
            throw new ValidationError("The requested email is already in use", 409);
        }
    
        next();
    } catch (error) {
        return res.status(error.statusCode).json({ error: error.message })
    }
    
}   
/* ************************ */

router.post("/register", validateRegistration, async (req, res) => { 
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.create({ email, password: hashedPassword})
    .then(() => res.status(201).json({ message: 'User registered successfully' }))
    .catch(error => res.status(500).json({ error: "An unexpected error occurred with the server" }));
})

router.post("", async (req, res) => {  
        try {
            const { email, password } = req.body;
            const user = await users.findOne({ email });
            
            if (user == null) {
                console.log("404 User not found")
                throw new ValidationError("User not found", 404);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                console.log("Incorrect password")
                throw new ValidationError("Incorrect password", 401);
            }

            const token = jwt.sign(
                { password: user.password, email: user.email, isAdmin: user.isAdmin },
                'your-secret-key', // Replace this with a long random string used for signing the token
                { expiresIn: '1h' } // Token expires in 1 hour
            );
            
            let favourites = Array.from(user.favourites, ([key, value]) => ({ key, value }));
            favourites = JSON.stringify(favourites);
            return res.status(200).json({ token, favourites });

        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error);
                return res.status(500).json({ error: "An unexpected error occurred with the server" });
            }
        }
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