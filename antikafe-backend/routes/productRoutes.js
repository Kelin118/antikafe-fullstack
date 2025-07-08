const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole'); // 👈 добавляем

// Группы
router.get('/groups', verifyToken, controller.getGroups);
router.post('/groups', verifyToken, checkRole('admin'), controller.createGroup);
router.delete('/groups/:id', verifyToken, checkRole('admin'), controller.deleteGroup);

// Товары
router.get('/', verifyToken, controller.getProducts);
router.post('/', verifyToken, checkRole('admin'), controller.createProduct);
router.delete('/:id', verifyToken, checkRole('admin'), controller.deleteProduct);
router.patch('/:id', verifyToken, checkRole('admin'), controller.updateProduct);

module.exports = router;
