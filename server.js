const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/sugestao', (req, res) => {
    const { nome, ingredientes } = req.query;

    res.status(200).send(`
        <h1>Obrigado pela sugestão!</h1>
        <h2>Dados da sugestão enviada: </h2>
        <p><b>Nome do lanche:</b> ${nome}</p>
        <p><b>Ingredientes:</b> ${ingredientes}</p>
        <p>
            <a href="/">Voltar para página inicial</a>
        </p>
    `);
});

app.get('/contato', (_, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
    res.status(200).send(`
        <h1>Mensagem recebida com sucesso! </h1>
        <h2>Iremos analisar e entrar em contato o mais breve possível.</h2>
        <h2>Informações enviadas:</h2>
        <p><b>Nome:</b> ${nome}</p>
        <p><b>E-mail:</b> ${email}</p>
        <p><b>Assunto:</b> ${assunto}</p>
        <p><b>Mensagem:</b> ${mensagem}</p>
        <p>
            <a href="/">Voltar para página inicial</a>
        </p>
    `);
});

app.get('/api/lanches', (_, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'cardapio.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const cardapioData = JSON.parse(fileContent);

        if (!Array.isArray(cardapioData)) {
            return res.status(500).send('Erro: O formato do arquivo JSON deve ser um array.');
        }

        if (cardapioData.length < 3) {
            return res.status(500).send('Erro: O array deve conter pelo menos 3 lanches.');
        }

        cardapioData.forEach(lanche => {
            if (!lanche.id || typeof lanche.id !== 'string' || lanche.id.trim() === '') {
                return res.status(500).send('Erro: Cada lanche deve ter um id válido.');
            }
            if (!lanche.nome || typeof lanche.nome !== 'string' || lanche.nome.trim() === '') {
                return res.status(500).send('Erro: Cada lanche deve ter um nome válido.');
            }
            if (!lanche.ingredientes || typeof lanche.ingredientes !== 'string' || lanche.ingredientes.trim() === '') {
                return res.status(500).send('Erro: Cada lanche deve ter ingredientes válidos.');
            }
        });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cardapioData);
    } catch (error) {
        console.error('Erro ao ler ou analisar o arquivo JSON:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

app.use((_, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});