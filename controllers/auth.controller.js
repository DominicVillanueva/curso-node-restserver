const { response } = require("express");
const UserModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generateJWT");

const login = async(req, res = response) => {
    const { email, password } = req.body;
    
    try {
        // Verificar si el email existe
        const user = await UserModel.findOne({ email });
        if(!user) {
            return res.status(400).json({ 
                msg: 'Usuario / password no son correctos!!!',
            });
        };
        // Verificar si el usuario se encuentra activo
        if(!user.status) {
            return res.status(400).json({
                msg: 'El usuario no se encuentra activo!',
            });
        };

        // Verificar la contraseña
        const isValidPassword = bcryptjs.compareSync(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({
                msg: '¡Contraseña incorrecta!',
            });
        }

        // Genear el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: '¡Algo salió mal!'
        });
    }
};

module.exports = {
    login,
}
