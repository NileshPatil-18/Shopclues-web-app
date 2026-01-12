const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const { 
    getAllProductsAdmin, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductByIdAdmin 
} = require('../controllers/adminProductController'); // Fixed import

const { 
    getAllOrdersAdmin, 
    updateOrderStatus,
    getOrderAnalytics
} = require('../controllers/adminOrderController'); // Fixed import

const router = express.Router();

// Add debug middleware
router.use((req, res, next) => {
    console.log(`🛣️ Admin route: ${req.method} ${req.originalUrl}`);
    console.log('Query:', req.query);
    next();
});

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Product Routes
router.get('/products', getAllProductsAdmin);
router.get('/products/:id', getProductByIdAdmin);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order Routes
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics/orders', getOrderAnalytics);

// Test route
router.get('/test', (req, res) => {
    console.log('✅ Admin test route - User:', req.user);
    res.json({
        success: true,
        message: 'Admin routes are working',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;