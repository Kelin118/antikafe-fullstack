const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // ✅

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Подключаем маршруты с правильным префиксом
app.use('/api/auth', authRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    // эти параметры можно удалить в новых версиях драйвера
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');

    // создаём индекс на email (по желанию)
    const User = require('./models/User');
    User.collection.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } }
      }
    ).then(() => {
      console.log('✅ Partial index on email ensured');
    }).catch((indexErr) => {
      console.error('❌ Ошибка при создании индекса email:', indexErr);
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
