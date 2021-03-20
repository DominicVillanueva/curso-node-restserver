const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const { createdCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controller');

const { isValidIdCategory } = require('../helpers/db-validators');

const router = Router();

/**
 * {{ url }}/api/category
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por ID
// Validar id de la categoria
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos,
], getCategoryById);

// Crear categoria - protegido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createdCategory);

// Actualizar categoria - protegido
// Validar nombre a cambiar.
router.put('/:id', [
    validarJWT,
    check('name', ' El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos,
], updateCategory);

// Eliminar categoria - Admin - protegido
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos,
], deleteCategory);

module.exports = router;
