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
    category: {
        type: mongoose.Schema.Types.ObjectId, // ✅ Reference to Category model
        ref: "Category",
        required: true,
      },
    brand:{
        type : String,   
    },
    image:{
        type : String,
        required : true,
    },
    description:{
        type : String,
        trim:true,
    }
    
},
{timestamps:true}
);

const Product = mongoose.model('Product',productSchema);
module.exports=Product;