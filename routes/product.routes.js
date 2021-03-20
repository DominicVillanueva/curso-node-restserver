const { Router } = require('express');
const { check } = require('express-validator');
const { isValidIdCategory, isValidIdProduct, isExistNameProduct } = require('../helpers/db-validators');
const { validarJWT, validarCampos } = require('../middlewares');

const { addProduct, getProducts, getProductByID, updateProduct, deleteProduct } = require('../controllers/product.controller');

const router = Router();

/**
 * {{ url }}/api/products
 */

// Obtener todas las categorias - publico
router.get('/', getProducts);

// Obtener producto por id - validar
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    validarCampos,
], getProductByID);

// Guardar nuevo producto - validar
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser solo número').not().isString(),
    check('category', 'No es un ID válido').isMongoId(),
    check('category').custom(isValidIdCategory),
    validarCampos
], addProduct);

// Actualizar producto - validar
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    validarCampos,
], updateProduct);

// Eliminar producto - VALIDAR
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    validarCampos,
], deleteProduct);

module.exports = router;
