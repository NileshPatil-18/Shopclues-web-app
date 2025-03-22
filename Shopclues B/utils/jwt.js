const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require("dotenv").config();


const SECRET_KEY = process.env.JWT_SECRET;

const payload = {id: User._id, email:User.email};
const generateToken = (payload,expiresIn = '1d')=>{
    return jwt.sign(payload,SECRET_KEY,{expiresIn});
};

const verifyToken = (token)=>{
   try {
        return jwt.verify(token,SECRET_KEY);
   } catch (error) {
        return null;
   }
};

module.exports = {generateToken, verifyToken};