const jwt = require('jsonwebtoken');

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

module.exports = {
    generarJWT,
}
