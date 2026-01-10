const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const getAllProductsAdmin = async(req,res)=>{
    try {
        console.log('📦 Admin fetching products...');
        const { page=1, limit=20, search, category, sort = '-createdAt'} = req.query;

        let query = {};

        if(search){
            query.$or =[
                {name:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}}
            ];
        }

        if(category){
            query.category = category;
        }

        const skip = (page-1)*limit;

        const[products,total]= await Promise.all([
            Product.find(query)
                .populate('category','name')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments(query)
        ]);

        console.log(`✅ Found ${products.length} products`);

        res.status(200).json({
            success:true,
            products,
            pagination:{
                total,
                page:parseInt(page),
                limit:parseInt(limit),
                pages:Math.ceil(total/limit)
            }
        })

    } catch (error) {
        console.error("❌ Admin get products error:",error);
        res.status(500).json({
            success:false,
            message:"failed to fetch products",
            error:error.message
        });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, image, brand, stock } = req.body;

        // Validate required fields
        if (!name || !price || !category || !image) {
            return res.status(400).json({
                success: false,
                message: "Name, price, category, and image are required"
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist"
            });
        }

        const product = new Product({
            name,
            price,
            category,
            description: description || "",
            image,
            brand: brand || "",
            stock: stock || 100
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: await Product.findById(product._id).populate('category', 'name')
        });

    } catch (error) {
        console.error("❌ Create product error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("❌ Update product error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("❌ Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};

// Get product by ID for admin
const getProductByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate('category', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("❌ Get product by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

module.exports = {
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByIdAdmin
};