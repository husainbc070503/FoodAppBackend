const express = require('express');
const Order = require('../models/Orders');
const FetchUser = require('../middlewares/Isloggedin');
const router = express.Router();
const razorpay = require('razorpay');

const rzp = new razorpay({
    key_id: "rzp_test_FlqRfa8gpkyIvH",
    key_secret: "eArahzoMi3ZwNGpqOoPruXne",
})

router.post('/pay', FetchUser, async (req, res) => {
    const { purchasedProducts, totalPrice } = req.body;

    try {

        const products = JSON.parse(purchasedProducts);

        let order = await Order.create({ purchasedUser: req.user._id, purchasedProducts: products, totalPrice });

        order = await Order.findById(order._id)
            .populate('purchasedUser', '-password')
            .populate('purchasedProducts')

        if (order) {
            const payment_capture = 1
            const amount = order.totalPrice * 100
            const currency = "INR"

            const options = {
                amount,
                currency,
                payment_capture
            }

            try {
                const resp = await rzp.orders.create(options);

                res.status(200).json({
                    order,
                    id: resp.id,
                    amount: resp.amount,
                    currency: resp.currency,
                    name: "Go Food",
                    description: resp.description
                });
                
            } catch (error) {
                res.status(400).json({ error: error.message })
            }

        } else {
            res.status(400).send("Server Error");
            return;
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;