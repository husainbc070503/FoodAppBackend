const express = require('express');
const FetchUser = require('../middlewares/Isloggedin');
const Contact = require('../models/Contact');
const router = express.Router();

router.post('/contact', FetchUser, async (req, res) => {
    const { message } = req.body;
    let success = false;

    try {

        if (!message) {
            res.status(400).json({ success, error: "Please fill all the required fields." });
            return;
        }

        let contact = await Contact.create({ user: req.user._id, message });
        contact = await Contact.findOne({ _id: contact._id }).populate('user', '-password');

        if (contact) {
            success = true;
            res.status(200).json({ success, contact });
        } else {
            res.status(400).json({ success, error: "Failed to contact!" });
            return;
        }

    } catch (error) {
        res.status(400).json({ success, error: error.message })
    }
});

module.exports = router