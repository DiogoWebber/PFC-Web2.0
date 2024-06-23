const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');

// Exemplo de rota GET
router.get('/', accountsController.getAccounts);

// Exemplo de rota POST
router.post('/', accountsController.addAccounts); // Verifique se addAccounts está definido corretamente

// Exemplo de rota DELETE
router.delete('/:id', accountsController.deleteAccount);

module.exports = router;
