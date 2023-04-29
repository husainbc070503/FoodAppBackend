const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        lowercase: true
    },

    price: {
        type: Number,
        require: true,
        default: 0
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        require: true
    },

    description: {
        type: String,
        trim: true,
        require: true
    },

    image: {
        type: String,
        trim: true,
        default: "https://media.istockphoto.com/id/1455160776/photo/selection-of-healthy-food.jpg?s=2048x2048&w=is&k=20&c=fA1XlXLyL-HqLIbxbXCHUDgRsQSTB7Nh7RDk2KnFk5k="
    },

    quantity: {
        type: Number,
        default: 0,
        require: true
    }
});

const FoodItem = mongoose.model('item', ItemSchema);

module.exports = FoodItem