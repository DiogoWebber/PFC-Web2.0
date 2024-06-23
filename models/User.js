const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    level: { type: String, default: 'OFF' },
    status: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
