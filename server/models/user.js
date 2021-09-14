const mongoose = require('mongoose');

const userShcema = new mongoose.Schema({
    email: String,
    phone: String,
    password: String,
    fullname: String,
    image: String
})

const User = mongoose.model('User', userShcema);

module.exports = User;