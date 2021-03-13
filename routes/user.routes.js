const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole, isValidEmail, isValidIDUser } = require('../helpers/db-validators');

const { validarCampos, validarJWT, isAdminRole, isExistRole } = require('../middlewares')

const {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch } = require('../controllers/user.controller');


const router = Router();

router.get('/', userGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIDUser),
    check('role').custom(isValidRole),
    validarCampos,
],userPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(isValidEmail),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validarCampos
],userPost);

router.delete('/:id',[
    validarJWT,
    // isAdminRole,
    isExistRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIDUser),
    validarCampos,
],userDelete);

router.patch('/', userPatch);

module.exports = router;