const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/cars.db');

module.exports = class sqlite {
    constructor(config) {
        this.config = config;

        this.connect = () => {
        }
    }
}

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

// db.close();