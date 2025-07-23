const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Регистрация компании и первого пользователя
exports.register = async (req, res) => {
  try {
    const { companyName, companyLogin, companyEmail, username, login, email, password } = req.body;

    if (!companyName || !companyLogin || !username || !login || !password) {
      return res.status(400).json({ message: 'Обязательные поля отсутствуют' });
    }

    // Проверка на существование логина компании
    const existingCompany = await Company.findOne({ login: companyLogin });
    if (existingCompany) {
      return res.status(400).json({ message: 'Компания с таким логином уже существует' });
    }

    // Создание компании
    const newCompany = new Company({ name: companyName, login: companyLogin, email: companyEmail });
    await newCompany.save();

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание первого пользователя (админ)
    const newUser = new User({
      username,
      login,
      email,
      password: hashedPassword,
      role: 'admin',
      companyId: newCompany._id,
    });

    await newUser.save();

    res.status(201).json({ message: 'Компания и пользователь успешно зарегистрированы' });
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

// Вход
exports.login = async (req, res) => {
  try {
    const { companyLogin, login, password } = req.body;

    // Поиск компании
    const company = await Company.findOne({ login: companyLogin });
    if (!company) {
      return res.status(400).json({ message: 'Компания не найдена' });
    }

    // Поиск пользователя в этой компании
    const user = await User.findOne({ login, companyId: company._id });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерация токена
    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        login: user.login,
        role: user.role,
        email: user.email,
        companyId: user.companyId,
      },
    });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
};
