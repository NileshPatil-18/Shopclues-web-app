const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // 🛠 Find the user's cart
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty, cannot place order" });
        }

        // ✅ Calculate total price
        let totalPrice = 0;
        const orderItems = Cart.items.map(item => {
            totalPrice += item.quantity * item.productId.price;  // Multiply quantity with price
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            };
        });

        // ✅ Create the order
        const order = new Order({
            userId,
            items,
            totalPrice,  // ✅ Include totalPrice
            status: "Pending"
        });

        await order.save();

        // ✅ Clear cart after order placement
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        console.error("Order placement error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({  userId }).populate('items.product');

        res.status(200).json(orders || []);

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // ✅ Validate status
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated', order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message });
    }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
