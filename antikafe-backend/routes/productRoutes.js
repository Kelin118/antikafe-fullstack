const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Товары
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Группы
router.get('/groups', productController.getGroups);
router.post('/groups', productController.createGroup);
router.delete('/groups/:id', productController.deleteGroup);

module.exports = router;
