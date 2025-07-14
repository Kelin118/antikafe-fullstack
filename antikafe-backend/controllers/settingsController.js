// controllers/settingsController.js
const Settings = require('../models/settingsModel');
const multer = require('multer');
const path = require('path');

// Настройка хранения логотипа
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Получение настроек по companyId
const getSettings = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let settings = await Settings.findOne({ companyId });

    if (!settings) {
      settings = await Settings.create({ companyId });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении настроек' });
  }
};

// Обновление настроек
const updateSettings = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updates = req.body;

    const settings = await Settings.findOneAndUpdate(
      { companyId },
      updates,
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении настроек' });
  }
};

// Загрузка логотипа
const uploadLogo = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const logoUrl = `/uploads/logos/${req.file.filename}`;

    const settings = await Settings.findOneAndUpdate(
      { companyId },
      { logoUrl },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при загрузке логотипа' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo,
  upload
};
