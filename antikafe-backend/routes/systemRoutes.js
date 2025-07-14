// routes/systemRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/systemController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken); // все защищены авторизацией

router.get('/roles', controller.getRoles);
router.post('/roles', controller.createRole);
router.put('/roles/:id', controller.updateRole);
router.delete('/roles/:id', controller.deleteRole);

module.exports = router;
