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

    return res
        .status(200)
        .send(await req.app.get('DB')
            .query(`SELECT * FROM car LIMIT ${quantity};`)
        );
});

// Rota que retorna as informações de uma carro pelo ID;
router.get('/:car_id', async function (req, res) {
    if (req?.params?.car_id.match(/\D+/)) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Paramater "car_id" must be a positive integer!');
    };

    var car_id = parseInt(req?.params?.car_id);

    return res
        .status(200)
        .send(await req.app.get('DB')
            .query(`SELECT * FROM car WHERE id = ${car_id};`)
        );
});

// TODO: Terminar esta rota; (Inserir carro no banco)
router.post('/', async function (req, res) {
    res
    .status(200)
    .send(await req.app.get('DB')
        .query(`SELECT * FROM car;`)
    );
});

// Rota para deletar carro pelo id dele no banco;
router.delete('/delete/:car_id', async function (req, res) {
    if (req?.params?.car_id.match(/\D+/)) {
        return req.app.get('Utils')
            .buildError(res, 400, 'Paramater "car_id" must be a positive integer!');
    };

    var car_id = parseInt(req?.params?.car_id);

    await req.app.get('DB')
        .query(`DELETE FROM car WHERE id = ${car_id};`)

    return res
        .status(200)
        .send();
});

router.put('/', async function (req, res) {
    try {
        // TODO: Fazer insert do ID da montadora pelo nome colocado;
        req.app.get('DB')
            .secureQuery(`
                UPDATE car
                SET model=?, "year"=?, manufacturer_id=?, mpg=?
                WHERE id =?;
            `,
            [
                req.body.model,
                req.body.year,
                req.body.manufacturer,
                req.body.mpg,
                req.body.id
            ]);
        res
        .status(200)
        .send();
    }
    catch (err) {
        console.log(err);
        res
        .status(200)
        .send();
    };
});

module.exports = router;