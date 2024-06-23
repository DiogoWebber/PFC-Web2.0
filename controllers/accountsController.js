// controllers/accountsController.js

// Importe o modelo de Account aqui, se não estiver já importado
const Account = require('../models/Account');

async function getAccounts(req, res) {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        console.error('Error fetching accounts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addAccounts(req, res) {
    const { accountName, bank, accountNumber, balance } = req.body;
    try {
        const newAccount = new Account({ accountName, bank, accountNumber, balance });
        await newAccount.save();
        res.status(201).json({ success: true, account: newAccount });
    } catch (err) {
        console.error('Error adding account:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteAccount(req, res) {
    const accountId = req.params.id;
    try {
        const deletedAccount = await Account.findByIdAndDelete(accountId);
        if (!deletedAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAccounts,
    addAccounts,
    deleteAccount
};
