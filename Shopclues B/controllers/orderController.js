const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const placeOrder = async (req, res) => {
    try {
        console.log("User from token:", req.user);  // ✅ Debugging

        const { items, totalPrice, paymentMethod, address } = req.body;
        const userId = req.user?.id;  // ✅ Ensure userId is retrieved

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing. Authentication required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        const formattedItems = items.map(item => {
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
            }
            return { product: new mongoose.Types.ObjectId(item.product), quantity: item.quantity };
        });

        const order = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            items: formattedItems,
            totalPrice,
            paymentMethod,
            address
        });

        await order.save();

        res.status(201).json({ message: 'Order placed successfully', order });

    } catch (error) {
        console.error("Order placement error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
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
