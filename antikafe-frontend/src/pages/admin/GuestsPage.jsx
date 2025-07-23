import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function GuestsPage() {
  const [groups, setGroups] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(() => setGroups([...groups]), 60000); // ⏱ обновление каждую минуту
    return () => clearInterval(interval);
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests');
      const guests = response.data;

      // Группировка по groupId
      const grouped = {};
      guests.forEach(guest => {
        const groupId = guest.groupId || 'no-group';
        if (!grouped[groupId]) grouped[groupId] = [];
        grouped[groupId].push(guest);
      });

      const sortedGroups = Object.entries(grouped).map(([groupId, members]) => ({
        groupId,
        guests: members,
        createdAt: members[0]?.createdAt || null
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setGroups(sortedGroups);
    } catch (error) {
      console.error('Ошибка при получении гостей:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить гостя?')) return;
    try {
      await axios.delete(`/guests/${id}`);
      fetchGuests();
    } catch (error) {
      console.error('Ошибка при удалении гостя:', error);
    }
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setDateFilter(selected);
  };

  const filteredGroups = dateFilter
    ? groups.filter(group => dayjs(group.createdAt).format('YYYY-MM-DD') === dateFilter)
    : groups;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Группы гостей</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Фильтр
          </button>
          <button
            onClick={() => navigate('/admin/add-group')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Добавить гостя
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => {
              setDateFilter('');
            }}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Сбросить фильтр
          </button>
        </div>
      )}

      {filteredGroups.length === 0 ? (
        <p className="text-gray-500">Нет гостей для отображения</p>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map((group, i) => {
            const total = group.guests.reduce(
              (sum, g) => sum + (g.products?.reduce((s, p) => s + p.price, 0) || 0),
              0
            );
            const minutesAgo = dayjs().diff(group.createdAt, 'minute');

            return (
              <div key={i} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">🧑‍🤝‍🧑 Группа #{group.groupId.slice(0, 6)}</h2>
                  <div className="text-gray-500">
                    ⏱ {minutesAgo} мин назад • 💰 {total} ₸
                  </div>
                </div>

                <ul className="space-y-2">
                  {group.guests.map((g) => (
                    <li
                      key={g._id}
                      className="flex justify-between items-start bg-gray-50 px-4 py-3 rounded"
                    >
                      <div>
                        <div className="font-semibold">{g.name}</div>
                        {g.products?.length > 0 && (
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {g.products.map((p, idx) => (
                              <li key={idx}>{p.name} — {p.price} ₸</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(g._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
