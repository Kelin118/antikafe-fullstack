
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

export default function AddGuestGroup() {
  const [guestName, setGuestName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('/products/groups');
        setGroups(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке групп товаров:', err);
      }
    };
    fetchGroups();
  }, []);

  const handleAddGuest = (e) => {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (trimmed) {
      setGuestList([...guestList, trimmed]);
      setGuestName('');
    }
  };

  const handleSubmit = async () => {
    if (!guestList.length) return;
    try {
      await axios.post('/guests/group', { guests: guestList });
      navigate('/admin/guests');
    } catch (err) {
      console.error('Ошибка при сохранении группы гостей:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Sidebar: Группы товаров */}
      <aside className="w-full lg:w-1/3 bg-white dark:bg-gray-800 border rounded-xl shadow p-4 h-fit">
        <h2 className="text-lg font-bold text-primary mb-4">Группы товаров</h2>
        {groups.length > 0 ? (
          <ul className="space-y-2">
            {groups.map((group) => (
              <li
                key={group._id}
                className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {group.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Нет доступных групп.</p>
        )}
      </aside>

      {/* Main Content: Добавление гостей */}
      <main className="w-full lg:w-2/3 bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Добавить группу гостей</h1>
        <form onSubmit={handleAddGuest} className="flex gap-3 mb-4">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Введите имя и нажмите Enter"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            +
          </button>
        </form>

        {guestList.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-secondary mb-2">Список гостей:</h2>
            <ul className="list-disc list-inside mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
              {guestList.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
            <button
              onClick={handleSubmit}
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-800 transition"
            >
              Сохранить группу
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
