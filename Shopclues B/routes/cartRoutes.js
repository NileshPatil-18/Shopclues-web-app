const express = require("express");
const authMiddleware = require('../middlewares/authMiddleware');

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");


const router = express.Router();

router.post("/cart",authMiddleware, addToCart); // Add item to cart
router.get("/cart",authMiddleware, getCart); // Get cart by userId
router.put("/cart", authMiddleware,updateCartItem); // Update cart item quantity
router.delete("/cart/item",authMiddleware, removeCartItem); // Remove single item
router.delete("/cart",authMiddleware, clearCart); // Clear entire cart

module.exports = router;
