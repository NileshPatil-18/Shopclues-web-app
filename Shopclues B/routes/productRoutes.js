const express = require('express');
const {addProduct,getAllProducts} = require('../controllers/productController')


const router = express.Router();

router.post('/products',addProduct);
router.get('/products',getAllProducts);

module.exports = router;