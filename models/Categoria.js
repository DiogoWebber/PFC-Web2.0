const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    categoria: { type: String, required: true },
    
});

const Categoria = mongoose.model('Categoria', userSchema);

module.exports = Categoria;
