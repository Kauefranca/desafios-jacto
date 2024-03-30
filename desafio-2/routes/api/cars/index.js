const express = require('express');
const router = express.Router();

const MAX_ITEM_PER_QUERY = Infinity;

// Rota para listar carros;
router.get('/', async function (req, res) {
    if (!req?.query?.q) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Missing query "q" in url');
    };

    if (req?.query?.q.match(/\D+/)) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Url query "q" must be a positive integer!');
    };

    var quantity = parseInt(req?.query?.q);

    if (!quantity || quantity > MAX_ITEM_PER_QUERY) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Url query "q" must be greater than 0 and less or equal to ' + MAX_ITEM_PER_QUERY);
    };

    return res.status(200)
        .send(await req.app.get('DB')
            .query(`SELECT
                        car.id AS id,
                        car.model AS model,
                        manufacturer.name AS manufacturer,
                        car.year AS year,
                        car.mpg AS mpg
                    FROM
                        car
                        INNER JOIN manufacturer ON manufacturer.id = car.manufacturer_id
                    LIMIT(?);
            `, [ quantity ])
        );
});

// Rota que retorna as informações de uma carro pelo ID;
router.get('/:car_id', async function (req, res) {
    if (req?.params?.car_id.match(/\D+/)) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Paramater "car_id" must be a positive integer!');
    };

    var car_id = parseInt(req?.params?.car_id);

    return res.status(200)
        .send(await req.app.get('DB')
            .query(`SELECT
                car.id AS id,
                car.model AS model,
                manufacturer.name AS manufacturer,
                car.year AS year,
                car.mpg AS mpg
            FROM
                car
                INNER JOIN manufacturer ON manufacturer.id = car.manufacturer_id
            WHERE car.id = ?`
            ,[ car_id ])
        );
});

// Rota para cadastrar novos carros;
router.post('/', async function (req, res) {
    try {
        let {
            model,
            manufacturer,
            year,
            mpg
        } = { ...req.body }

        if (!model || !manufacturer || !year || !mpg) {
            return req.app.get('Utils')
                .buildError(res, 400, 'Invalid json input!');
        };

        if (typeof(year) == Number || typeof(mpg) == Number) {
            return req.app.get('Utils')
                .buildError(res, 400, 'Paramater "year" and "mpg" must be positive numbers!');
        };

        manufacturer = manufacturer.toLowerCase().trim();

        await req.app.get('DB')
            .query(`
                INSERT OR IGNORE INTO manufacturer
                    (name)
                    VALUES(?)
            `, [ manufacturer ]);

        let insertId = await req.app.get('DB')
            .run(`
                INSERT INTO car
                (model, "year", manufacturer_id, mpg)
                SELECT ?, ?, id, ?
                FROM manufacturer WHERE name = ?;
            `, [ model.trim(), year, mpg, manufacturer ]);

        return res.status(200)
            .send([insertId])
    }
    catch (err) {
        console.log(err);
        return req.app.get('Utils')
            .buildError(res, 500);
    };
});

// Rota para deletar carro pelo id dele no banco;
router.delete('/delete/:car_id', async function (req, res) {
    if (req?.params?.car_id.match(/\D+/)) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Paramater "car_id" must be a positive integer!');
    };

    var car_id = parseInt(req?.params?.car_id);

    await req.app.get('DB')
        .query(`DELETE FROM car WHERE id = ?;`, [ car_id ]);

    return res.status(200)
        .send();
});

// Rota para efetuar modificações em carros já existentes no banco de dados;
router.put('/', async function (req, res) {
    try {
        let {
            id,
            model,
            manufacturer,
            year,
            mpg
        } = { ...req.body }

        if (!id || !model && !manufacturer && !year && !mpg) {
            return req.app.get('Utils')
                .buildError(res, 400, 'Invalid json input!');
        };

        if (typeof(year) == Number || typeof(mpg) == Number) {
            return req.app.get('Utils')
                .buildError(res, 400, 'Field "year" and "mpg" must be positive numbers!');
        };


        let [ car ] = await req.app.get('DB')
            .query(`SELECT * FROM car WHERE id = ?;`, [ id ])
            
        if (!car) {
            return req.app.get('Utils')
                .buildError(res, 400, `Car with id: ${id} was not found in database!`);
        };

        let selected_manufacturer;
        
        if (manufacturer) {
            manufacturer = manufacturer.toLowerCase().trim();
    
            await req.app.get('DB')
                .query(`
                    INSERT OR IGNORE INTO manufacturer
                        (name)
                        VALUES(?)
                `, [ manufacturer ]);

            [ selected_manufacturer ] = await req.app.get('DB')
                .query(`SELECT id FROM manufacturer
                        WHERE name = ?
                `, [ manufacturer ]);
        };

        await req.app.get('DB')
            .run(`
                UPDATE car
                SET model=?, "year"=?, manufacturer_id=?, mpg=?
                WHERE id=?;
            `, [
                model || car.model,
                year || car.year,
                selected_manufacturer.id,
                mpg || car.mpg,
                car.id
            ]);

        return res.status(200)
            .send()
    }
    catch (err) {
        console.log(err);
        return req.app.get('Utils')
            .buildError(res, 500);
    };
});

module.exports = router;