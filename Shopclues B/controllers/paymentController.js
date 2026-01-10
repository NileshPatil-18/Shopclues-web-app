const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        console.log("Payment intent requested by user:", req.user?.id);
        
        const { amount, currency = 'usd' } = req.body;

        // Debug logging
        console.log("Payment request data:", {
            amount,
            currency,
            userId: req.user?.id,
            userEmail: req.user?.email
        });

        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                message: 'Valid amount is required',
                received: amount 
            });
        }

        // Convert to cents and validate
        const amountInCents = Math.round(parseFloat(amount));
        
        if (isNaN(amountInCents) || amountInCents < 50) {
            return res.status(400).json({ 
                message: 'Invalid amount. Minimum payment is $0.50',
                amount: amountInCents 
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency.toLowerCase(),
            payment_method_types: ['card'],
            metadata: {
                userId: req.user?.id || 'unknown',
                userEmail: req.user?.email || 'unknown',
                orderType: 'ecommerce_payment'
            }
        });

        console.log("Payment intent created successfully:", {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            clientSecret: paymentIntent.client_secret.substring(0, 20) + '...'
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amountInCents / 100
        });

    } catch (error) {
        console.error("Stripe error:", error.message);
        
        res.status(500).json({ 
            success: false,
            message: 'Payment processing failed',
            error: error.message,
            code: error.type || 'stripe_error'
        });
    }
};

module.exports = { createPaymentIntent };