const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            }
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
