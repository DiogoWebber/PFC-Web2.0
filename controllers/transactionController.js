const Transaction = require('../models/Transaction');

async function getTransactions(req, res) {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addTransaction(req, res) {
    const { description, value, type, date, categoria, dueDate } = req.body; // Adicionando dueDate ao desestruturar req.body
    try {
        const newTransaction = new Transaction({ description, value, type, date, categoria, dueDate }); // Incluindo dueDate na criação de nova transação
        await newTransaction.save();
        res.status(201).json({ success: true, transaction: newTransaction });
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteTransaction(req, res) {
    const transactionId = req.params.id;
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateTransaction(req, res) {
    const transactionId = req.params.id;
    const { description, value, type, date, dueDate } = req.body; // Adicionando dueDate ao desestruturar req.body
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId,
            { description, value, type, date, dueDate }, // Incluindo dueDate na atualização
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
};
