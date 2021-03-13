const isValidFields = require('../middlewares/validar-campos');
const isValidJWT = require('../middlewares/validar-jwt');
const isValidRole = require('../middlewares/validar-roles');

module.exports = {
    ...isValidFields,
    ...isValidJWT,
    ...isValidRole,
}
