const express = require('express');
const FoodItem = require('../models/FoodItem');
const router = express.Router();

router.post('/addItem', async (req, res) => {
    let success = true;
    const { name, price, category, description, image, quantity } = req.body;

    try {

        if (!name || !price || !category || !description || !quantity || !image) {
            res.status(400).json({ success, error: "Please fill all the required fields" });
            return;
        }

        let item = await FoodItem.findOne({ name, category });
        if (item) {
            res.status(400).json({ success, error: "Item already exists!" });
            return;
        }

        item = await FoodItem.create({ name, price, category, description, quantity, image });
        item = await FoodItem.findById(item._id).populate('category');

        if (item) {
            success = true;
            res.status(200).json({ success, item });
            return;
        } else {
            res.status(400).json({ success, error: "Failed to add category." });
            return;
        }


    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
})


router.put('/editItem/:id', async (req, res) => {
    let success = false;
    const { name, price, description, quantity } = req.body;

    try {

        const newItem = {};

        if (name) newItem.name = name;
        if (price) newItem.price = price
        if (description) newItem.description = description;
        if (quantity) newItem.quantity = quantity

        let item = await FoodItem.findByIdAndUpdate(req.params.id, newItem, { new: true })

        item = await FoodItem.findById(item._id).populate('category');

        if (item) {
            success = true;
            res.status(200).json({ success, item });
            return;
        } else {
            res.status(400).json({ success, error: "Bad Request" });
            return;
        }

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
})


router.delete('/deleteItem/:id', async (req, res) => {
    let success = false;

    try {

        let item = await FoodItem.findById(req.params.id);
        if (!item) {
            res.status(404).json({ success, error: "Food item doesn't exists." });
            return;
        }

        item = await FoodItem.findByIdAndDelete(req.params.id);

        if (item) {
            success = true
            res.status(200).json({ success, item });
            return;
        } else {
            res.status(400).json({ success, error: "Bad Request" });
            return;
        }

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
})


router.get('/getAllItems', async (req, res) => {
    try {

        const item = await FoodItem.find().populate('category');
        res.status(200).json(item);

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
})

module.exports = router;