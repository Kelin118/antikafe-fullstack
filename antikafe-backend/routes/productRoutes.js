const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');

// Товары
router.get('/', verifyToken, productController.getProducts);
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

// Группы
router.get('/groups', verifyToken, productController.getGroups);
router.post('/groups', verifyToken, productController.createGroup);
router.delete('/groups/:id', verifyToken, productController.deleteGroup);

module.exports = router;
