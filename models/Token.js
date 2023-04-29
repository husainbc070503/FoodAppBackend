const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },

    token: {
        type: Number,
        default: 0
    },

    expiresIn: {
        type: Number,
        default: 0
    },

    requestedOn: {
        type: mongoose.Schema.Types.Date,
        default: new Date().getTime()
    }
});

const Token = mongoose.model('token', TokenSchema);

module.exports = Token