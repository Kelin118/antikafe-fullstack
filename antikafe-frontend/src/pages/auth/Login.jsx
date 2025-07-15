import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Взяли login из контекста
  const [formData, setFormData] = useState({
    companyLogin: '',
    userLogin: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await login(formData);
  if (success) {
    navigate('/site/home'); // ⬅️ Теперь перенаправляем на сайт
  } else {
    setError('Ошибка входа');
  }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Вход</h1>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyLogin"
          placeholder="Логин компании"
          value={formData.companyLogin}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="userLogin"
          placeholder="Логин пользователя"
          value={formData.userLogin}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-green-600 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
