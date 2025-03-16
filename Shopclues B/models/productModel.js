const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim:true,
    },
    price:{
        type : Number,
        required : true,
        min: 0,
    },
    category:{
        type : String,
        required : true,
    },
    brand:{
        type : String,   
    },
    image:{
        type : String,
        required : true,
    },
},
{timestamp:true}
);

const Product = mongoose.model('Product',productSchema);
module.exports=Product;