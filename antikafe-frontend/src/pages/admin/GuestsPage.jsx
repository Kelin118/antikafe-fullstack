import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import dayjs from 'dayjs';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
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
        <ul className="space-y-3">
          {filteredGuests.map((guest) => (
            <li
              key={guest._id}
              className="flex justify-between items-center p-4 bg-white rounded shadow"
            >
              <span>{guest.name}</span>
              <button
                onClick={() => handleDelete(guest._id)}
                className="text-red-600 hover:underline"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
