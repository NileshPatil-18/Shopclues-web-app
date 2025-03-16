const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/orders', authMiddleware, placeOrder);
router.get('/orders', authMiddleware, getUserOrders);
router.get('/admin/orders', authMiddleware, getAllOrders);
router.put('/orders/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
