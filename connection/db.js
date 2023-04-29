require('dotenv').config();
const url = process.env.MONGODB_URL;
const mongoose = require('mongoose');

const ConnectDB = () => {
    mongoose.set('strictQuery', false)
    try {
        return mongoose.connect(url, () => {
            console.log("Connected to database")
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = ConnectDB;