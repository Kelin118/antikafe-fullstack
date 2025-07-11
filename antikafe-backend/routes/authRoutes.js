const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// ✅ Регистрация компании + администратора
router.post('/register-company', async (req, res) => {
  const {
    companyName,
    companyLogin,
    email,
    phone,
    adminUsername,
    adminLogin,
    adminPassword
  } = req.body;

  try {
    const existing = await Company.findOne({ login: companyLogin });
    if (existing) {
      return res.status(400).json({ message: 'Компания уже существует' });
    }

    const company = new Company({ name: companyName, login: companyLogin, email, phone });
    await company.save();

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      username: adminUsername,
      login: adminLogin,
      password: hashedPassword,
      role: 'admin',
      companyId: company._id
    });
    await admin.save();

    res.status(201).json({ message: 'Компания и администратор зарегистрированы' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

// ✅ Вход сотрудника
router.post('/login', async (req, res) => {
  const { companyLogin, userLogin, password } = req.body;

  try {
    const company = await Company.findOne({ login: companyLogin });
    if (!company) {
      return res.status(401).json({ message: 'Неверный логин компании' });
    }

    const user = await User.findOne({ login: userLogin, companyId: company._id });
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({
      userId: user._id,
      companyId: company._id,
      role: user.role,
      username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка входа' });
  }
});

// ✅ Удаление пользователя (с проверкой роли)
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
  const userIdToDelete = req.params.id;
  const requestingUserId = req.user.userId;

  if (userIdToDelete === requestingUserId) {
    return res.status(400).json({ error: 'Вы не можете удалить самого себя' });
  }

  try {
    await User.findByIdAndDelete(userIdToDelete);
    res.json({ message: 'Пользователь удален' });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

module.exports = router;
