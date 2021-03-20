const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        // GET CURRENT USER
        const currentUser = await UserModel.findById(uid);
        if(!currentUser) {
            return res.status(401).json({
                msg: 'El usuario no se encuentra regístrado',
            });
        }
        // Verficiar si el usuario se encuentra Habilitado
        if(!currentUser.status) {
            return res.status(401).json({
                msg: 'El usuario se encuentra deshabilitado',
            });
        }

        req.user = currentUser; // Crear un nuevo valor para el req con el usuario logueado
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
};

module.exports = {
    validarJWT,
}
