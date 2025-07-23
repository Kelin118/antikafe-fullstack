const express = require('express');
const router = express.Router();
const { openShift, closeShift } = require('../controllers/shiftController');
const verifyToken = require('../middleware/verifyToken');
const Shift = require('../models/Shift'); // ✅ Добавляем импорт модели

// Открытие смены
router.post('/open', verifyToken, openShift);

// Закрытие смены
router.post('/close', verifyToken, closeShift);

// Проверка статуса смены (открыта или нет)
router.get('/status', verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const openShift = await Shift.findOne({ companyId, isOpen: true });
    res.json({ isOpen: !!openShift });
  } catch (err) {
    console.error('Ошибка при проверке смены:', err);
    res.status(500).json({ message: 'Ошибка проверки статуса' });
  }
});

module.exports = router;
