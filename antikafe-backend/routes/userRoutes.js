const express = require('express');
const bcrypt = require('bcrypt'); 
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// Получить всех пользователей (только для admin)
router.get('/', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

// Изменить роль пользователя (admin)
router.patch('/:id/role', verifyToken, checkRole('admin'), async (req, res) => {
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении роли' });
  }
});

// ✅ Оставить этот
router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
  const { username, login, password, role } = req.body;

  if (!username || !login || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const companyId = req.user.companyId;

    const existing = await User.findOne({ login, companyId });
    if (existing) {
      return res.status(400).json({ error: 'Логин уже используется в этой компании' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      login,
      password: hashedPassword,
      role,
      companyId,
    });

    await newUser.save();

    res.status(201).json({ message: 'Сотрудник создан' });
  } catch (err) {
    console.error('Ошибка при создании пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера при создании пользователя' });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const shifts = await Shift.find({ companyId })
      .sort({ openedAt: -1 })
      .populate('cashierId', 'name') // чтобы отобразить имя кассира
      .lean();
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения истории смен' });
  }
});


module.exports = router;
