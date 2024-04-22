const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser')

const mongoURI = 'mongodb+srv://juliareisrodrigues5:123@cluster0.9vj78v4.mongodb.net/teste?retryWrites=true&w=majority&appName=Cluster0';

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB rodando'))
    .catch(err => console.log(err));

app.get('/alpha', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

app.get('/cadastro_pac', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'views', 'cadastro_pac.html'));
});

app.get('/bemvindo', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public','views', 'bemvindo.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT,()=> {
    console.log('Está rodando na porta $(PORT)');
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log("Email:", email);
    console.log("Senha:", senha);
    try {
        const user = await mongoose.connection.db.collection('usuarios').findOne({ email: email });
        console.log("Usuário encontrado:", user); 
        if (user && user.senha === senha) {
            res.redirect('/bemvindo');
        } else {
            res.status(401).send("<script>alert('E-mail ou senha incorretos'); window.location.href = '/login';</script>");
        }
    } catch (error) {
        console.error('Usuário não encontrado:', error);
        res.status(500).send("Erro interno do servidor");
    }
});


