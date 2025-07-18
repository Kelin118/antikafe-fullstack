import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();

  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests');
      setGuests(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке гостей:', error);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Гости</h1>
        <button
          onClick={() => navigate('/admin/add-group')}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-xl transition-all"
        >
          Добавить гостя
        </button>
      </div>

      {guests.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Гостей пока нет</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          {guests.map((guest) => (
            <div
              key={guest._id}
              className="flex items-center justify-between border-b py-2 last:border-b-0"
            >
              <span>{guest.name}</span>
              <span className="text-sm text-gray-400">{new Date(guest.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
