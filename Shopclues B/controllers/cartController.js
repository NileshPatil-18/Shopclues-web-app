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

        for (const item of items) {
            if (!item.productId || !item.quantity) {
              return res.status(400).json({ message: "Invalid item: productId and quantity are required" });
            }
          }
      
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        items.forEach(({ productId, quantity }) => {
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
        });

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
        const userId = req.user.id;
        const cart = await Cart.findOne({userId}).populate("items.productId");

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

const updateCartItem = async(req, res)=>{
    try {
        const userId = req.user.id;
        const {productId,quantity} = req.body;

        const cart = await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({
                message:'cart not found'
            })
        }

        const item = cart.items.find(
            (item)=>item.productId.toString() === productId.toString()
        );

        if(!item){
            return res.status(404).json({
                message:'product not in cart'
            });
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({
            message:'cart updated',
            cart
        })
        
    } catch (error) {
        res.status(500).json({
            message:"server error",
            error:error.message
        })
    }
}

const removeCartItem = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
  
      await cart.save();
      res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  const clearCart = async (req, res) => {
    try {
      const { userId } = req.user.id;
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