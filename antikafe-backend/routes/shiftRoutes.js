const express = require('express');
const router = express.Router();
const { openShift, closeShift } = require('../controllers/shiftController');
const verifyToken = require('../middleware/verifyToken');

router.post('/open', verifyToken, openShift);
router.post('/close', verifyToken, closeShift);

module.exports = router;
