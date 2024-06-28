const jwt = require('jsonwebtoken');

// Função para validar o token
exports.validateToken = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const SECRET_KEY = process.env.SECRET_KEY;
  console.log(SECRET_KEY);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    res.status(200).json({ valid: true, user });
  });
};
