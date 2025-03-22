const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    description:{
        type: String,
        trim: true
    },
},{timestamps: true});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;