const Stripe = require('stripe');
const Order = require('../models/orderModel'); 
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ message: 'Amount and currency are required' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to smallest currency unit
            currency,
            payment_method_types: ['card']
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createPaymentIntent };
