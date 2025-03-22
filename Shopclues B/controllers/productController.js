const Product = require("../models/productModel");

// ✅ Add New Product
const addProduct = async (req, res) => {
  try {
    const { name, price, category, brand, image, description } = req.body;

    // Validation
    if (!name || !price || !category  || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ name, price, category, brand, image, description });
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Products (Supports Search & Category Filtering)
const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query; // Get search & category from query

    let query = {};

    // 🔎 Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 📂 Filter by category
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Products by Category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId }).populate("category");

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addProduct, getAllProducts, getProductById, getProductsByCategory };
