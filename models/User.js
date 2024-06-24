const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Definindo _id como String e gerando o ID único com uuidv4
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    level: { type: String, default: 'OFF' },
    status: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
