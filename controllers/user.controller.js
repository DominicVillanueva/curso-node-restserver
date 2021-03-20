const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/user.model');

const userGet = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};
    
    const [total, users] = await Promise.all([
        UserModel.countDocuments(query),
        UserModel.find(query)
                .skip(Number(from))
                .limit(Number(limit)),
    ]);

    res.json({
        total,
        users,
    });
};

const userPut = async(req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...user } = req.body;

    if(password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    }

    const userUpdate = await UserModel.findByIdAndUpdate(id, user);

    res.json(userUpdate);
};

const userPost = async(req, res) => {
    const { name, email, password, role } = req.body;
    const user = new UserModel({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        user,
    });
};

const userDelete = async (req, res = response) => {
    const { id } = req.params;
    // Fisicamente borraros el registro
    // const user = await UserModel.findByIdAndDelete(id);
    const user = await UserModel.findByIdAndUpdate(id, { status: false });
    res.json({
        user,
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
