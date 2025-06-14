const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    }).then(() => {
        console.log('MongoDB Connected');
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = connectDB;

