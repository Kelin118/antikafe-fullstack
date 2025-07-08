const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// Получить все продажи (admin, manager)
router.get('/', verifyToken, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId soldBy');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении продаж' });
  }
});

// Создать продажу (все роли)
router.post('/', verifyToken, checkRole('admin', 'manager', 'employee'), async (req, res) => {
  try {
    const sale = new Sale({
      ...req.body,
      soldBy: req.user.userId
    });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка при добавлении продажи' });
  }
});

module.exports = router;
