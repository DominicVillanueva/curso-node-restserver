const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validateFileUpload } = require('../middlewares');
const { loadFile, showImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers');

const router = Router();

router.post('/', validateFileUpload, loadFile);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('collection').custom(nameCollection => allowedCollections(nameCollection, ['users', 'products'])),
    validarCampos,
], updateImageCloudinary);

// updateImage);

router.get('/:collection/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('collection').custom(nameCollection => allowedCollections(nameCollection, ['users', 'products'])),
    validarCampos,
], showImage)

module.exports = router;