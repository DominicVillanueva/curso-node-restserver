const { response, request } = require("express");
const UserModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generateJWT");

const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const {name, img, email} = await googleVerify(id_token);

        // Verificar si el correo existe
        let user = await UserModel.findOne({ email });
        if(!user) {
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':)',
                img,
                google_signin: true
            };

            user = new UserModel(data);
            await user.save();
        }

        // Si el usuario se encuentra en status = false.
        if(!user.status) {
            return res.status(401).json({
                msg: 'Usuario bloqueado.',
            });
        };

        // Genear el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg:'Token de google no es válido',
        });
    }
};

const rebuildToken = async(req, res = response) => {
    const { user } = req;

    // Genear el JWT
    const token = await generarJWT(user.id);

    res.json({
        user,
        token
    });
};

module.exports = {
    login,
    googleSignIn,
    rebuildToken,
}
