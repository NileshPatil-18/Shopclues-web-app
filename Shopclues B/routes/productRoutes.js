const express = require('express');
const {addProduct,getAllProducts,getProductById,getProductsByCategory} = require('../controllers/productController')


const router = express.Router();

router.post('/products',addProduct);
router.get('/products',getAllProducts);
router.get('/products/:id',getProductById);
router.get('/products/category/:categoryId',getProductsByCategory);

module.exports = router;