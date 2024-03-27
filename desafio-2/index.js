const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(require('./routes'))

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});