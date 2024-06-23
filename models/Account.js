const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Account', accountSchema);
