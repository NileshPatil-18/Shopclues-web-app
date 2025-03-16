const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async(req,res)=>{
    try {

        console.log("Received request body:", req.body); 
        const userId = req.user.id;
        const {productId,quantity} = req.body;

        let cart = await Cart.findOne({userId});

        if(!cart){
            cart = new Cart({userId,items:[]});
        }

        const existingItem = cart.items.find(
            (item)=>item.productId.toString() === productId.toString()
        );

        if(existingItem){
            existingItem.quantity += quantity;
        }else{
            cart.items.push({productId,quantity});
        }

        await cart.save();
        res.status(201).json({
            message:"product added to cart",
            cart
        });
        
    } catch (error) {
        res.status(500).json({
            message:"server error",
            error: error.message
        });
    }
}


const getCart = async(req,res)=>{
    try {
        const {userId} = req.user.id;
        const cart = await Cart.findOne({userId}).populate("items.productId");

        if(!cart){
            return res.status(404).json({
                message : 'cart is empty'
            });
        }

        res.status(200).json(cart);
        
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
            (item)=>item.productId.toString() === productId
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
        (item) => item.productId.toString() !== productId
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