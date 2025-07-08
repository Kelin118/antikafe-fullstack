const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyToken'); // защита

router.get('/', verifyToken, bookingController.getBookings);
router.post('/', verifyToken, bookingController.createBooking);
router.patch('/:id', verifyToken, bookingController.updateBooking);
router.delete('/:id', verifyToken, bookingController.deleteBooking);

module.exports = router;
