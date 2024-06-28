// controllers/categoriasController.js
const Categoria = require('../models/Categoria');

async function getCategorias(req, res) {
    try {
      const categorias = await Categoria.find();
      res.json(categorias);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

const addCategorias = async (req, res) => {
    try {
      const { nome } = req.body; // Certifique-se de que está recebendo 'nome' corretamente
      const novaCategoria = new Categoria({ categoria: nome }); // Crie um novo objeto de categoria com o campo correto
  
      await novaCategoria.save(); // Salve a nova categoria no banco de dados
  
      res.status(201).json(novaCategoria); // Retorne a nova categoria como resposta
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      res.status(400).json({ message: 'Erro ao adicionar categoria.', error });
    }
  };
  
async function deleteCategorias(req, res) {
    const categoriaId = req.params.id; // Obtém o ID da categoria a ser excluída dos parâmetros da URL
    try {
        const deletedCategoria = await Categoria.findByIdAndDelete(categoriaId);
        if (!deletedCategoria) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    getCategorias,
    addCategorias,
    deleteCategorias
};
