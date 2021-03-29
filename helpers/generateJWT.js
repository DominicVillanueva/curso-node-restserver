const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

const generarJWT = (uid = '') => {
    return new Promise((res, rej) => {
        const payload = { uid }; // Info del usuario
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h',
        }, (err, token) => {
            if(err) {
                console.log(err);
                rej('No se puede generar el token');
            } else {
                res(token);
            }
        });
    });
}

const comprobarJWT = async(token = '') => {
    try {
        if(token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await UserModel.findById(uid);

        if(user) {
            if(user.status) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

module.exports = {
    generarJWT,
    comprobarJWT,
}
