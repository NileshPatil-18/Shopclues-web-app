const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        console.log("Request user:", req.user); 
        console.log("Request body:", req.body);

        const userId = req.user?.id; // Ensure userId is retrieved from req.user
        const { items } = req.body; // Get items array

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array is required" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        for (const { productId, quantity } of items) {  // ✅ Changed forEach to for...of
            if (!productId) {
                return res.status(400).json({ message: "Product ID is required" });
            }
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: "Quantity must be greater than zero" });
            }

            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(201).json({
            message: "Product(s) added to cart",
            cart: cart.items,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const getCart = async(req,res)=>{
    try {
        const userId = req.user?.id;
        const cart = await Cart.findOne({userId}).populate("items.productId");

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User not found." }); // ✅ Changed from 400 to 401
        }
        if(!cart){
            return res.status(404).json({
                message : 'cart is empty'
            });
        }

        res.status(200).json(cart.items);
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error:error.message
        });
    }

}

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId.toString()
        );

        if (!item) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        if (quantity === 0) {
            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId.toString()
            ); // Remove item if quantity is 0
        } else {
            item.quantity = quantity; // Update quantity
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const removeCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body; // Ensure productId is from req.body

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



  const clearCart = async (req, res) => {
    try {
      const userId  = req.user?.id;
      await Cart.findOneAndDelete({ userId });
  
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  module.exports = { 
        addToCart,
        getCart, 
        updateCartItem, 
        removeCartItem, 
        clearCart
     };