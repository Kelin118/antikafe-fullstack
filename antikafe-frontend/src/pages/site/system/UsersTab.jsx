import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';

export default function UsersTab() {
  const [employees, setEmployees] = useState([]);
  const [newUser, setNewUser] = useState({ login: '', password: '', role: 'manager' });
  const [roles, setRoles] = useState(['admin', 'manager', 'cashier']);

  const companyId = localStorage.getItem('companyId');

  const fetchUsers = async () => {
    const res = await axios.get(`/users?companyId=${companyId}`);
    setEmployees(res.data);
  };

  const handleAdd = async () => {
    if (!newUser.login || !newUser.password) return;
    await axios.post('/users', { ...newUser, companyId });
    setNewUser({ login: '', password: '', role: 'manager' });
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    await axios.put(`/users/${userId}/role`, { role: newRole });
    fetchUsers();
  };

  useEffect(() => {
    if (companyId) fetchUsers();
  }, [companyId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Пользователи</h2>

      {/* Добавление нового пользователя */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <input
          type="text"
          value={newUser.login}
          onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
          placeholder="Логин"
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Пароль"
          className="border rounded px-3 py-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border rounded px-3 py-2"
        >
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded">
          ➕ Добавить
        </button>
      </div>

      {/* Таблица сотрудников */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Логин</th>
            <th className="border px-3 py-2">Роль</th>
            <th className="border px-3 py-2">Изменить</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border px-3 py-2">{emp.login}</td>
              <td className="border px-3 py-2">{emp.role}</td>
              <td className="border px-3 py-2">
                <select
                  value={emp.role}
                  onChange={(e) => handleRoleChange(emp._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
