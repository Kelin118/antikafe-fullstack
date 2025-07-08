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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Роуты
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/guests', guestRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// 📦 Подключение к MongoDB и запуск сервера
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  // ✅ Создание уникального индекса на email, если он задан
  try {
    const User = require('./models/User');
    await User.collection.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } } // индекс только если email строка
      }
    );
    console.log('✅ Partial index on email ensured');
  } catch (indexErr) {
    console.error('❌ Ошибка при создании индекса email:', indexErr);
  }

  // 🚀 Запуск сервера
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
