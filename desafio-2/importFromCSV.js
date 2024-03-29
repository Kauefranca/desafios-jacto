// Script usado para transferir os dados do csv para o banco de dados.

const { parse } = require(`csv-parse`);
const { createReadStream } = require('fs');
const SQL_CONN = require('./lib/sqlite');
const DB = new SQL_CONN();

var parser = parse({ columns: true }, function (err, linhas) {
    var count = 0;

    for (let linha of linhas) {
        // Quantidade de linhas a serem importadas;
        if (count >= 50) break;

        // Verifica se a montadora do carro já está cadastrada e cria caso não exista;
        DB.query(`INSERT OR IGNORE INTO manufacturer
            (name)
            VALUES('${linha.Manufacturer}')
        `);

        // Insere o carro na tabela com base no CSV importado;
        DB.query(`INSERT INTO car
            (model, "year", manufacturer_id, mpg)
            SELECT '${linha.model.trim()}', ${linha.year}, id, ${linha.mpg}
            FROM manufacturer WHERE name = '${linha.Manufacturer}';
        `);

        count++;
    }
});

// Lê o arquivo CSV e passa para a função parse;
createReadStream(__dirname + '/CarsData.csv')
.pipe(parser);