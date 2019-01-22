const express = require('express');
const router = express.Router();
const debug = require('debug')('debugInfo');
const { Genre, validate } = require('../models/genre');

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    debug('find all ---', genres);
    res.send(genres);
});


router.post('/', async (req, res) => {
    debug('post ---', req.body);

    //如果报错则返回并不执行后面的
    const { error } = validate(req.body);
    if (error) {
        debug('error:---', error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    //成功则存入数据库
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    debug('post result ----', genre);
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    debug('update ---', req.params.id, req.body);

    //验证输入错误
    const { error } = validate(req.body);
    if (error) {
        debug('error:---', error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    //更新某一条updateOne,更新多条updateMany
    const result = await Genre.updateOne({ _id: req.params.id }, {//我们可以在这了设置条件比如这里是id，我们也可以设置其他条件比如author：'dd’符合的进行更新
        $set: {
            name: req.body.name
        }
    }).catch(error => {//抓取更新时报错
        debug(`error:---, ${error.message},
        The genre with the given ID was not found.`);
    });

    if (!result) return res.status(404).send('The genre with the given ID was not found.');

    debug('update result ---', result);
    res.send(result);

});

router.delete('/:id', async (req, res) => {
    debug('remove id ---', req.params.id);

    const genre = await Genre.findByIdAndRemove(req.params.id)
        .catch(error => {//抓取更新时报错
            debug(`error:---, ${error.message},
        The genre with the given ID was not found.`);
        });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    debug('delete item ---', genre);
    res.send(genre);
});

router.get('/:id', async (req, res) => {
    debug('find id ---', req.params.id);
    const genre = await Genre.findById(req.params.id)
        .catch(error => {//抓取更新时报错
            debug(`error:---, ${error.message},
        The genre with the given ID was not found.`);
        });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    debug('find item ---', genre);
    res.send(genre);
});

module.exports = router;