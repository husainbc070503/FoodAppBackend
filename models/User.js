const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    pic: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/user-profile-icon-trendy-flat-600w-1923506948.jpg"
    },

    date: {
        type: Date,
        default: Date.now()
    },

    address: {
        type: String,
        require: true
    }
})

const User = mongoose.model('user', UserSchema);

module.exports = User