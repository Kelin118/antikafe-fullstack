const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const productRoutes = require('./routes/productRoutes');
const guestRoutes = require('./routes/guestRoutes');
const userRoutes = require('./routes/userRoutes');
const saleRoutes = require('./routes/saleRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

dotenv.config();

const app = express();

// ✅ Правильная настройка CORS — СРАЗУ после app
app.use(cors({
  origin: 'https://antikafe-frontend.vercel.app',
  credentials: true,
}));

app.use(express.json());

// 🔗 Роуты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/guests', guestRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/test', (req, res) => {
  res.send('✅ Backend работает!');
});

// 📦 Подключение к MongoDB и запуск сервера
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  // ✅ Индекс email
  try {
    const User = require('./models/User');
    await User.collection.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } }
      }
    );
    console.log('✅ Partial index on email ensured');
  } catch (indexErr) {
    console.error('❌ Ошибка при создании индекса email:', indexErr);
  }

  // 🚀 Запуск сервера
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});