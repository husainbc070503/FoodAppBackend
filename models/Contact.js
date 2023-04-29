const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    message: {
        type: String,
        trim: true,
        require: true
    }
});

const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact