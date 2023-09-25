const { ValidationError } = require("../errors/Errors");
const users = require("../model/user");


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

module.exports = validateRegistration;