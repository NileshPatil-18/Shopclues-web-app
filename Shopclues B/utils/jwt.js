const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role // Add role to token
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

const verifyToken = (token) => {
   try {
        return jwt.verify(token, SECRET_KEY);
   } catch (error) {
        console.error('Token verification error:', error.message);
        return null;
   }
};

module.exports = { generateToken, verifyToken };