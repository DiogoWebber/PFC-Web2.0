const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors')
const userRoutes = require('./routes/userRoutes'); // Certifique-se de definir seus próprios routes se existirem
const transactionRoutes = require('./routes/transactionRoutes');
const accountsRoutes = require('./routes/accountsRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const authRoutes = require('./routes/authRoutes');

const mongoose = require('mongoose');

const app = express();

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB', err);
    }
}

connectToDatabase();

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'seu_secreto_aqui',
    resave: false,
    saveUninitialized: true
}));

require('dotenv').config();


app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());

app.use(cors({
    origin: true, 
    credentials: true
}));

// Middleware de registro para verificar as solicitações para arquivos estáticos
app.use((req, res, next) => {
    console.log('Recebida solicitação para:', req.url);
    next();
});

// Rotas para transações
app.use('/api', transactionRoutes);

// Rotas para contas
app.use('/accounts', accountsRoutes);

// Rotas para usuários (se existirem)
app.use('/user', userRoutes);

app.use('/categorias', categoriasRoutes)

app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta http://localhost:${PORT}`);
});
