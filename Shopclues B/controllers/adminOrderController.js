const Order = require('../models/orderModel');

// Get all orders for admin
const getAllOrdersAdmin = async (req, res) => {
    try {
        console.log('📋 Admin fetching orders...');
        
        const { page = 1, limit = 20, status, startDate, endDate, sort = '-createdAt' } = req.query;
        let query = {};

        // Status filter
        if (status && status.trim() !== "") {
            query.status = status;
        }


        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const skip = (page - 1) * limit;

        console.log('Query:', query);

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('userId', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(query)
        ]);

        console.log(`✅ Found ${orders.length} orders out of ${total} total`);

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("❌ Admin get orders error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`🔄 Updating order ${id} status to ${status}`);

        // Validate status - match your Order model enum
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
                validStatuses
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        console.log(`✅ Order ${id} updated to ${status}`);

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("❌ Update order status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

// Get order analytics
const getOrderAnalytics = async (req, res) => {
    try {
        console.log('📊 Fetching order analytics...');

        // Get orders count by status
        const statusCounts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Get total revenue
        const revenueStats = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { 
                _id: null, 
                totalRevenue: { $sum: "$totalPrice" }, 
                totalOrders: { $sum: 1 } 
            } }
        ]);

        // Get monthly revenue for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: { $ne: 'Cancelled' },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        console.log('✅ Analytics fetched');

        res.status(200).json({
            success: true,
            analytics: {
                statusCounts,
                totalRevenue: revenueStats[0]?.totalRevenue || 0,
                totalOrders: revenueStats[0]?.totalOrders || 0,
                monthlyRevenue
            }
        });

    } catch (error) {
        console.error("❌ Order analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};

module.exports = {
    getAllOrdersAdmin,
    updateOrderStatus,
    getOrderAnalytics
};