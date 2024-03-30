const SQL = require('./lib/sqlite');
const Utils = require('./lib/utils');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = 8080;

// Variável usada para passar o objeto do banco através das diferentes rotas;
app.set('DB', new SQL());
app.set('Utils', new Utils());

// Configuração do express para formatar JSON recebido no body das requisições;
app.use(express.json());
// Função para evitar que erros de sintaxe JSON sejam passados para o client;
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return req.app.get('Utils')
            .buildError(res, 400, err.message);
    };
    next();
});

// Declaração para que todos os arquivos da pasta /routes sejam usados na aplicação;
app.use(require('./routes'));

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});