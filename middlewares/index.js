const isValidFields = require('../middlewares/validar-campos');
const isValidJWT = require('../middlewares/validar-jwt');
const isValidRole = require('../middlewares/validar-roles');
const isValidFile = require('../middlewares/validar-archivo');

module.exports = {
    ...isValidFields,
    ...isValidJWT,
    ...isValidRole,
    ...isValidFile,
}
