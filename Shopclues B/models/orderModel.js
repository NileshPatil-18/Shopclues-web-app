const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 1,
        default: 1
    },
    image: {
        type: String,
        default: ''
    }
}, { _id: false }); // Don't create separate _id for subdocuments

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    items: [orderItemSchema],
    totalPrice: { 
        type: Number, 
        required: true,
        min: 0,
        default: 0,
        get: (v) => parseFloat(v.toFixed(2)), // Always return with 2 decimal places
        set: (v) => parseFloat(v.toFixed(2))  // Store with 2 decimal places
    },
    paymentMethod: { 
        type: String, 
        required: true,
        enum: ["Cash on Delivery", "Credit Card", "Paypal", "Other"],
        default: "Cash on Delivery"
    },
    address: { 
        type: String, 
        required: true,
        trim: true
    },
    status: { 
        type: String, 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Pending",
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    }
}, { 
    timestamps: true,
    toJSON: { getters: true }, // Apply getters when converting to JSON
    toObject: { getters: true }
});

// Virtual for calculating total if missing
orderSchema.virtual('calculatedTotal').get(function() {
    if (this.items && this.items.length > 0) {
        return this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    return 0;
});

// Middleware to ensure totalPrice is set
orderSchema.pre('save', function(next) {
    if (!this.totalPrice || this.totalPrice === 0) {
        this.totalPrice = this.calculatedTotal;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;