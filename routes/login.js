const express = require('express');
const router = express.Router();
const users = require("../model/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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

            return token;

        } catch (error) {
            console.log(error);
        }
    }

    findUser(req).then(value => {
        console.log(value);
        return value == null ? res.status(404).json({error: "Wrong"}) : res.status(200).json({token : value});
    })
})

module.exports = router;