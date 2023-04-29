const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    purchasedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    purchasedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'item'
        }
    ],

    totalPrice: {
        type: Number,
        require: true,
        default: 0
    }
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;