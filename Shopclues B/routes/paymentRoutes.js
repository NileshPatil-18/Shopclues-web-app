const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

module.exports = router;
