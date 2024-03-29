const SQL = require('./lib/sqlite');
const Utils = require('./lib/utils');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = 8080;

// Variável usada para passar o objeto do banco através das diferentes rotas;
app.set('DB', new SQL());
app.set('Utils', new Utils());


app.use(express.json());
app.use(require('./routes'));

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});