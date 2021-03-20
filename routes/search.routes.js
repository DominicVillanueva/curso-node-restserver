const { Router } = require('express');
const router = Router();

const { search } = require('../controllers/search.controller');


router.get('/:collection/:term', search);

module.exports = router;
