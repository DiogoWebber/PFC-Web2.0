const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');

function sendSuccessResponse(res, data) {
    res.status(200).json({ success: true, data });
}

function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ success: false, error: message });
}

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return sendErrorResponse(res, 401, 'Usuário ou senha incorretos');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return sendErrorResponse(res, 401, 'Usuário ou senha incorretos');
        }

        if (user.level !== 'ON') {
            return sendErrorResponse(res, 403, 'Você não possui permissão de acesso.');
        }

        req.session.usuario = user;
        sendSuccessResponse(res, 'Usuário autenticado com sucesso!');
    } catch (error) {
        sendErrorResponse(res, 500, 'Erro no servidor');
    }
}

function createUserForm(req, res) {
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
}

async function createUser(req, res) {
    const { username, password, email, status } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return sendErrorResponse(res, 400, 'Nome de usuário indisponível');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email, level: 'OFF', status });
        await newUser.save();
        sendSuccessResponse(res, 'Usuário criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        sendErrorResponse(res, 500, 'Erro no servidor');
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        sendErrorResponse(res, 500, 'Erro no servidor');
    }
}

async function updateUserLevel(req, res) {
    const { userId } = req.params;
    const { level } = req.body;

    try {
        // Verifique se userId é um ObjectId válido (opcional, dependendo do seu schema)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'ID do usuário inválido' });
        }

        const user = await User.findByIdAndUpdate(userId, { level }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Se a atualização for bem-sucedida
        res.status(200).json({ success: true, message: 'Nível do usuário atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar nível do usuário:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar nível do usuário' });
    }
}

module.exports = {
    login,
    createUserForm,
    createUser,
    getAllUsers,
    updateUserLevel
};
