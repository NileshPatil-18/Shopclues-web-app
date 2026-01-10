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

router.post("/cart",authMiddleware, addToCart); 
router.get("/cart",authMiddleware, getCart); 
router.put("/cart/item", authMiddleware,updateCartItem); 
router.delete("/cart/:productId",authMiddleware, removeCartItem); 
router.delete("/cart",authMiddleware, clearCart); 

module.exports = router;
