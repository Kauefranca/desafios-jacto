// Objeto de conexão com o banco de dados;

const sqlite3 = require('sqlite3').verbose();

module.exports = class sqlite {
    constructor(config) {
        // Configurações globais do banco;
        // this.config = config ? config : {};
        this.db = config?.db_path ?
            new sqlite3.Database(config.db_path) :
            new sqlite3.Database('./db/cars.db');

        // Cria as tabelas do banco, caso elas não existam;
        this.db.run(`
            CREATE TABLE IF NOT EXISTS manufacturer (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
        );`);

        this.db.run(`        
            CREATE TABLE IF NOT EXISTS car (
                model VARCHAR(40) NOT NULL,
                year INTEGER NOT NULL,
                manufacturer_id INT,
                mpg REAL,
                FOREIGN KEY (manufacturer_id) 
                    REFERENCES manufacturer (manufacturer_id) 
                        ON DELETE CASCADE
        );`)

        // Função para executar queries no banco;
        this.query = (query) => {
            return new Promise((resolve, reject) => {
                this.db.all(query, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    };
};