require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET

const FetchUser = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {

            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(data.id).select("-password");
            next();

        } catch (error) {
            res.status(200).json({ error: error.message })
        }
    } else {
        res.status(400).json({ error: "Bad Request or Invalid Token" })
    }
}

module.exports = FetchUser