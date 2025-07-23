const express = require('express');
const router = express.Router();
const { openShift, closeShift } = require('../controllers/shiftController');
const verifyToken = require('../middleware/verifyToken');
const Shift = require('../models/Shift'); // ✅ Добавляем импорт модели
const Company = require('../models/Company'); 

// Открытие смены
router.post('/open', verifyToken, openShift);

// Закрытие смены
router.post('/close', verifyToken, closeShift);

// Проверка статуса смены (открыта или нет)
router.get('/status', verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const openShift = await Shift.findOne({ companyId, isOpen: true });

    console.log('[ПРОВЕРКА СТАТУСА]', { companyId, isOpen: !!openShift }); // ← лог

    res.json({ isOpen: !!openShift });
  } catch (err) {
    console.error('Ошибка при проверке смены:', err);
    res.status(500).json({ message: 'Ошибка проверки статуса' });
  }
});


router.get('/last-denominations', verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const company = await Company.findById(companyId);
    res.json(company?.lastDenominations || {});
  } catch {
    res.status(500).json({ message: 'Ошибка при получении данных' });
  }
  
});
router.get('/last', verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const lastShift = await Shift.find({ companyId })
      .sort({ openedAt: -1 })
      .limit(1)
      .lean();

    if (!lastShift.length) {
      return res.json(null);
    }

    res.json(lastShift[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения последней смены' });
  }
});

module.exports = router;
