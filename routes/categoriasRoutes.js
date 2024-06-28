const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Exemplo de rota GET
router.get('/all', categoriasController.getCategorias);

// Exemplo de rota POST
router.post('/setCategorias', categoriasController.addCategorias); // Verifique se addAccounts está definido corretamente

// Exemplo de rota DELETE
router.delete('/:id', categoriasController.deleteCategorias);

module.exports = router;
