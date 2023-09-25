/* Error thrown for registration and authentication */
class ValidationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { ValidationError }