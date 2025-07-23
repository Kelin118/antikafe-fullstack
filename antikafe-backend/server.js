const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Роуты
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const productRoutes = require('./routes/productRoutes');
const guestRoutes = require('./routes/guestRoutes');
const userRoutes = require('./routes/userRoutes');
const saleRoutes = require('./routes/saleRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const shiftRoutes = require('./routes/shiftRoutes');

dotenv.config();

const app = express();

// ✅ CORS до всего остального
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Подставляется Vercel-домен
  credentials: true,
}));

// ✅ Чтобы Express принимал JSON
app.use(express.json());

// ✅ Примитивный тест-эндпоинт
app.get('/api/test', (req, res) => {
  res.send('✅ Backend работает!');
});

// 🔗 Подключение роутов
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/shift', shiftRoutes);

// 📦 Подключение к MongoDB и запуск сервера
mongoose.connect(process.env.MONGO_URI, {
  // Эти опции уже не нужны, но можно оставить — не мешают
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ MongoDB connected');

  // Создание индекса email
  try {
    const User = require('./models/User');
    await User.collection.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      }
    );
    console.log('✅ Partial index on email ensured');
  } catch (err) {
    console.error('❌ Ошибка при создании индекса:', err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
