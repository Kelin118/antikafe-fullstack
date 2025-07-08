const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      companyId: decoded.companyId  // ✅ Это важно
    };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Неверный токен' });
  }
};
