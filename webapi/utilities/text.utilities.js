
exports.generateToken = () => {
    const crypto = require("crypto");
    return crypto.randomBytes(32).toString('base64url'); 
}