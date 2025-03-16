const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async ()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected succesfully");
    } 
    catch (error) {
        console.log("error occured during database connection",error)
    }
}
module.exports = connectDb;
