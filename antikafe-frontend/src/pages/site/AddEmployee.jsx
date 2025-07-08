import { useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    username: '',
    login: '',
    email: '',
    password: '',
    role: 'employee', // по умолчанию
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Сотрудник успешно добавлен');
      setFormData({
        username: '',
        login: '',
        email: '',
        password: '',
        role: 'employee',
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка при добавлении');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Добавить сотрудника</h2>
      {message && <p className="text-center text-blue-600 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Имя сотрудника" value={formData.username} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="login" placeholder="Логин" value={formData.login} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required className="w-full border p-2 rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="employee">Сотрудник</option>
          <option value="manager">Менеджер</option>
        </select>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Добавить</button>
      </form>
    </div>
  );
}
