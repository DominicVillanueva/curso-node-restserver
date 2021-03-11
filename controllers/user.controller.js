const { response, request } = require('express');
 

const userGet = (req = request, res = response) => {
    const { nombre = 'Not name', api_key, page = 1, limit } = req.query;
    res.json({
        msg: 'get API - userGet',
        nombre,
        api_key,
        page,
        limit,
    });
};

const userPut = (req, res) => {
    const idUser = req.params.id;
    res.status(400).json({
        msg: 'put API - userPut',
        idUser,
    });
};

const userPost = (req, res) => {
    const { nombre, edad } = req.body;
    res.status(201).json({
        msg: 'post API - userPost',
        nombre,
        edad,
    });
};

const userDelete = (req, res) => {
    res.json({
        msg: 'delete API - userDelete',
    });
};

const userPatch = (req, res) => {
    res.json({
        msg: 'patch API - userPatch',
    });
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch,
}
