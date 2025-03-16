const Product = require('../models/productModel');

const addProduct = async(req, res)=>{
    try {
        const {name,price,category,brand,image} = req.body;
        const newProduct = new Product({name ,price,category,brand,image});
        await newProduct.save();

        res.status(201).json({
            message:'product added succesfully',
            product : newProduct
        });
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error : error.message
        })
    }
};

const getAllProducts = async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message:'server error',
            error:error.message
        });
    }
}

const getProductById = async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message:'product not found'});
        }

        res.status(200).json(product);
        
    } catch (error){
    res.stauts(500).json({message:'server error',error:error.message});
    }
}

module.exports = {addProduct,getAllProducts};