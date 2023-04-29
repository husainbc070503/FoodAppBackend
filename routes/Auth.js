require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const genToken = require('../utils/GenrateToken');
const nodemailer = require('nodemailer');
const Token = require('../models/Token');

const mailer = (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: "Go Food Update Password",
        text: `Your token for changing password is: ${token}`
    };

    transporter.sendMail(options)
        .then((succ) => console.log(`Mail Send Successfully ${succ.accepted}`))
        .catch((err) => console.log(err));
}

const successMail = (email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: "Go Food ",
        text: `Alert! your password has been changed. If it not it please contact us!`
    };

    transporter.sendMail(options)
        .then((succ) => console.log(`Mail Send Successfully ${succ.accepted}`))
        .catch((err) => console.log(err));
}

/* Registration */
router.post('/register', async (req, res) => {
    const { name, email, password, pic, address } = req.body;
    let success = false;

    try {

        if (!email || !name || !password || !address) {
            res.status(400).json({ success, error: "Please fill the required fields" });
            return;
        }

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ success, error: "User already registered!" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        user = await User.create({ name, email, password: secPass, pic, address });

        if (user) {
            success = true;
            res.status(200).json({
                success, user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    token: genToken(user._id)
                }
            });
        } else {
            res.status(400).json({ success, error: "Failed to register" });
            return;
        }

    } catch (e) {
        res.status(400).json({ success, error: `${e.message}` });
    }
})

/* Login */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let success = false;

    try {

        if (!email || !password) {
            res.status(400).json({ success, error: "Please fill the required fields" });
            return;
        }

        let user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success, error: "User doesn't exists. Please register!" });
            return;
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            res.status(400).json({ success, error: "Invalid Credentials!" });
            return;
        }

        success = true;
        res.status(200).json({
            success, user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                address: user.address,
                token: genToken(user._id)
            }
        })

    } catch (error) {
        res.status(400).json({ success, error: `${error.message}` })
    }
});

/* Update Profile */
router.put('/updateProfile/:id', async (req, res) => {
    const { name, email, address } = req.body;
    let success = false;

    try {

        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({ success, error: "User doesn't exists. Please register!" });
            return;
        }

        user = await User.findByIdAndUpdate(req.params.id, {
            name, email, address
        }, { new: true });

        if (user) {
            success = true;
            res.status(200).json({
                success, user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    pic: user.pic,
                    address: user.address,
                    token: genToken(user._id)
                }
            })
        } else {
            res.status(400).json({ success, error: "Server error" });
            return;
        }

    } catch (error) {
        res.status(400).json({ success, error: `${error.message}` })
    }
})

/* Send Mail */
router.post('/sendMail', async (req, res) => {
    const { email } = req.body
    let success = false;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success, error: "User does not exists" });
            return;
        }

        const token = await Token.create({
            email,
            token: Math.floor(Math.random() * 10000),
            expiresIn: new Date().getTime() + 500 * 1000
        });

        success = true;
        mailer(email, token.token)
        res.status(200).json({ success, token })

    } catch (error) {
        res.status(400).json({ success, error: `${error.message}` })
    }
});


/* Change Password */
router.post('/changePassword', async (req, res) => {
    const { email, token, password } = req.body;
    let success = false;

    try {

        const t = await Token.findOne({ email, token });

        if (t) {
            const diff = t.expiresIn - new Date().getTime();
            if (diff < 0) {
                res.status(400).json({ success, error: 'Token Expired' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);

            let user = await User.findOne({ email });
            user = await User.findOneAndUpdate(user._id, { password: secPass }, { new: true });

            if (user) {
                success = true;
                res.status(200).json({
                    success, user
                });
                successMail(email)
            } else {
                res.status(400).json({ success, error: "Failed to update password" });
                return;
            }

        } else {
            res.status(400).json({ success, error: 'Invalid request' });
            return;
        }


    } catch (error) {
        res.status(400).json({ success, error: `${error.message}` })
    }
})


module.exports = router