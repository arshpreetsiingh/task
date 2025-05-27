const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});
