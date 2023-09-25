const jwt = require('jsonwebtoken');

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
        return res.status(401).json({ message: "Not authorized" });
    }
}

module.exports = authUser