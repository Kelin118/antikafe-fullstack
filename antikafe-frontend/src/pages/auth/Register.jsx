import { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogin: '',
    email: '',
    phone: '',
    adminUsername: '',
    adminLogin: '',
    adminPassword: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register-company', formData);
      setMessage('Компания успешно зарегистрирована!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Регистрация компании</h1>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="companyName" placeholder="Название компании" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="companyLogin" placeholder="Логин компании" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="phone" placeholder="Телефон" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="adminUsername" placeholder="Имя администратора" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="adminLogin" placeholder="Логин администратора" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="password" name="adminPassword" placeholder="Пароль" onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Зарегистрировать</button>
      </form>
    </div>
  );
}
  