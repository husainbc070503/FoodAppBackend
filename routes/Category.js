const express = require('express');
const Category = require('../models/FoodCat');
const router = express.Router();


router.post('/addCategory', async (req, res) => {
    const { name, active } = req.body;
    let success = false;

    try {

        let cat = await Category.findOne({ name });
        if (cat) {
            res.status(400).json({ success, error: "Category already exists" });
            return;
        }

        success = true;
        cat = await Category.create({ name, active });
        res.status(200).json({ success, cat })

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
});


router.put('/editCategory/:id', async (req, res) => {
    let success = false;
    try {

        const { name, active } = req.body;
        const cat = await Category.findByIdAndUpdate(req.params.id, { name, active }, { new: true });
        success = true;
        res.status(200).json({ success, cat })

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
});


router.get('/getCategories', async (req, res) => {
    try {
        
        const cats = await Category.find();
        res.status(200).json(cats)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});


router.delete('/deleteCategory/:id', async (req, res) => {
    let success = false;
    try {

        const cat = await Category.findByIdAndDelete(req.params.id);
        success = true;
        res.status(200).json({ success, cat })

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
});


module.exports = router