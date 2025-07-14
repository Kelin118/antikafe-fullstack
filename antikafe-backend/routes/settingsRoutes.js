// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, uploadLogo, upload } = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Все маршруты защищены авторизацией
router.use(authMiddleware);

// Получить настройки
router.get('/', getSettings);

// Обновить настройки
router.put('/', updateSettings);

// Загрузить логотип
router.post('/logo', upload.single('logo'), uploadLogo);

module.exports = router;
