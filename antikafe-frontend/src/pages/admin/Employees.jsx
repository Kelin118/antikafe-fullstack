import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/users/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка загрузки сотрудников');
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Сотрудники компании</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {employees.length === 0 ? (
        <p className="text-gray-600">Нет сотрудников</p>
      ) : (
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Логин</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Роль</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="text-center">
                <td className="p-2 border">{emp.username}</td>
                <td className="p-2 border">{emp.login}</td>
                <td className="p-2 border">{emp.email || '-'}</td>
                <td className="p-2 border capitalize">{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
