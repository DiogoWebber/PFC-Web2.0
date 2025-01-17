const Transaction = require('../models/Transaction');

// Controlador para obter todas as transações
async function getTransactions(req, res) {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controlador para adicionar uma nova transação
async function addTransaction(req, res) {
    const { description, value, type, date, categoria, dueDate, accountName } = req.body;
    try {
        const newTransaction = new Transaction({ description, value, type, date, categoria, dueDate, accountName });
        await newTransaction.save();
        res.status(201).json({ success: true, transaction: newTransaction });
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controlador para deletar uma transação
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

// Controlador para atualizar uma transação
async function updateTransaction(req, res) {
    const transactionId = req.params.id;
    const { description, value, type, date, dueDate, categoria, accountName } = req.body;
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { description, value, type, date, dueDate, categoria, accountName },
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
