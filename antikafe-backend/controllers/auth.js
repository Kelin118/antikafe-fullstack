const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    companyId: user.companyId  // 🔐 Это обязательное поле
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
