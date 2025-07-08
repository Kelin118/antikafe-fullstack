const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const verifyToken = require('../middleware/verifyToken');

// Защищённые маршруты
router.get('/', verifyToken, guestController.getGuests);
router.post('/', verifyToken, guestController.addGuest);
router.post('/group', verifyToken, guestController.addGuestGroup);
router.delete('/:id', verifyToken, guestController.deleteGuest);

module.exports = router;
