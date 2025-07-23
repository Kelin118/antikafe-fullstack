import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import dayjs from 'dayjs';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [now, setNow] = useState(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(() => setNow(dayjs()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests');
      setGuests(response.data);
      setFilteredGuests(response.data);
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
    const selectedDate = e.target.value;
    setDateFilter(selectedDate);
    const filtered = guests.filter((guest) =>
      dayjs(guest.createdAt).format('YYYY-MM-DD') === selectedDate
    );
    setFilteredGuests(filtered);
  };

  const getTotalForGuest = (guest) =>
    guest.products?.reduce((sum, p) => sum + (p.price || 0), 0);

  const groupedGuests = filteredGuests.reduce((acc, guest) => {
    const group = guest.groupId || 'single';
    if (!acc[group]) acc[group] = [];
    acc[group].push(guest);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Гости</h1>
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
              setFilteredGuests(guests);
              setDateFilter('');
            }}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Сбросить фильтр
          </button>
        </div>
      )}

      {filteredGuests.length === 0 ? (
        <p className="text-gray-500">Нет гостей для отображения</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedGuests).map(([groupId, groupGuests], i) => (
            <div key={groupId} className="border rounded-lg shadow p-4 bg-white">
              {groupId !== 'single' && (
                <h3 className="font-bold text-lg mb-2">Группа #{i + 1}</h3>
              )}
              <ul className="space-y-3">
                {groupGuests.map((guest) => (
                  <li
                    key={guest._id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <div className="font-semibold">{guest.name}</div>
                      <div className="text-sm text-gray-500">
                        {now.diff(dayjs(guest.createdAt), 'minute')} мин назад
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">
                        {getTotalForGuest(guest)} ₸
                      </div>
                      <button
                        onClick={() => handleDelete(guest._id)}
                        className="text-red-600 hover:underline text-sm mt-1"
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
