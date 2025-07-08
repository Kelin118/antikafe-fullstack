import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SystemPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    login: '',
    password: '',
    role: 'employee',
  });

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
    } catch (err) {
      console.error('Ошибка при обновлении роли:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      alert('Вы не можете удалить самого себя');
      return;
    }

    if (!window.confirm('Удалить пользователя?')) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Ошибка при удалении пользователя:', err);
      alert('Ошибка при удалении');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newUser);
      setIsModalOpen(false);
      setNewUser({ username: '', login: '', password: '', role: 'employee' });
      fetchUsers();
    } catch (err) {
      console.error('Ошибка при создании пользователя:', err);
      alert('Не удалось создать пользователя');
    }
  };

  const filteredUsers = users.filter(user => {
    const username = user.username || '';
    const login = user.login || '';
    const matchSearch =
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      login.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>

      <div className="flex gap-4 mb-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Поиск по имени или логину"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Все роли</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ Добавить сотрудника
        </button>
      </div>

      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="p-2 border">Имя</th>
            <th className="p-2 border">Логин</th>
            <th className="p-2 border">Роль</th>
            <th className="p-2 border">Изменить роль</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.login}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="employee">employee</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔵 Модалка создания сотрудника */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Создание сотрудника</h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                placeholder="Имя"
                className="w-full border p-2 rounded"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Логин"
                className="w-full border p-2 rounded"
                value={newUser.login}
                onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                className="w-full border p-2 rounded"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <select
                className="w-full border p-2 rounded"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
