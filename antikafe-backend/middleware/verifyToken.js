// verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Нет токена' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[VERIFY TOKEN] decoded:', decoded); // ← Посмотри, есть ли companyId
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Невалидный токен' });
  }
};
