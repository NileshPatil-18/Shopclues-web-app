const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Placing order for user:", userId);

        // Get cart with populated product details
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty, cannot place order" });
        }

        console.log("Cart items:", cart.items.length);

        // Calculate total price properly
        let totalPrice = 0;
        const orderItems = [];
        
        for (const item of cart.items) {
            if (!item.productId) {
                console.error("Missing product for item:", item);
                continue;
            }
            
            const itemPrice = item.productId.price || 0;
            const itemQuantity = item.quantity || 1;
            const itemTotal = itemPrice * itemQuantity;
            
            totalPrice += itemTotal;
            
            orderItems.push({
                productId: item.productId._id,
                quantity: itemQuantity,
                price: itemPrice,
                name: item.productId.name, // Store name for reference
                image: item.productId.image // Store image for reference
            });
        }

        console.log("Calculated totalPrice:", totalPrice);
        console.log("Order items:", orderItems.length);

        if (totalPrice <= 0) {
            return res.status(400).json({ 
                message: "Invalid order total. Please check cart items." 
            });
        }

        // Create the order with all data
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice: totalPrice.toFixed(2), // Ensure 2 decimal places
            paymentMethod: req.body.paymentMethod || "Cash on Delivery",
            address: req.body.address || "Not specified",
            status: "Pending",
            paymentStatus: req.body.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"
        });

        await order.save();
        console.log("Order saved successfully:", order._id);

        // Clear cart after successful order
        await Cart.findOneAndDelete({ userId });
        console.log("Cart cleared for user:", userId);

        // Return the order with populated product info
        const populatedOrder = await Order.findById(order._id)
            .populate('items.productId')
            .lean();

        res.status(201).json({ 
            success: true,
            message: "Order placed successfully", 
            order: populatedOrder || order
        });

    } catch (error) {
        console.error("Order placement error:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: error.message 
        });
    }
};

// Update the getUserOrders function too
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching orders for user:", userId);
        
        const orders = await Order.find({ userId })
            .populate({
                path: 'items.productId',
                select: 'name price image description' // Select only needed fields
            })
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance

        console.log(`Found ${orders.length} orders for user ${userId}`);
        
        // Ensure totalPrice is calculated if missing
        const validatedOrders = orders.map(order => {
            if (!order.totalPrice || order.totalPrice === 0) {
                // Calculate from items if missing
                const calculatedTotal = order.items.reduce((sum, item) => {
                    const price = item.productId?.price || item.price || 0;
                    const quantity = item.quantity || 1;
                    return sum + (price * quantity);
                }, 0);
                
                return {
                    ...order,
                    totalPrice: calculatedTotal.toFixed(2)
                };
            }
            return order;
        });

        res.status(200).json(validatedOrders);

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// module.exports = { placeOrder, getUserOrders };

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add this function to handle order status updates
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status transition
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        const validTransitions = {
            "Pending": ["Processing", "Cancelled"],
            "Processing": ["Shipped", "Cancelled"],
            "Shipped": ["Delivered"],
            "Delivered": [], // Final state
            "Cancelled": []  // Final state
        };

        // Get current order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if transition is valid
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: "Invalid order status",
                validStatuses 
            });
        }

        // Check if the status transition is allowed
        if (!validTransitions[order.status].includes(status)) {
            return res.status(400).json({ 
                message: `Cannot change status from ${order.status} to ${status}`,
                allowedTransitions: validTransitions[order.status]
            });
        }

        // Update order status
        order.status = status;
        
        // Add status history
        if (!order.statusHistory) {
            order.statusHistory = [];
        }
        
        order.statusHistory.push({
            status,
            updatedAt: new Date(),
            updatedBy: req.user.id // Or admin/user who updated
        });

        await order.save();

        res.status(200).json({ 
            message: 'Order status updated successfully', 
            order: await Order.findById(id).populate('items.productId')
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
