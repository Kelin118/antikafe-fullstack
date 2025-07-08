import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

export default function AddGuestGroup() {
  const [guestName, setGuestName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleAddGuest = (e) => {
    e.preventDefault();
    const trimmedName = guestName.trim();
    if (trimmedName) {
      setGuestList([...guestList, trimmedName]);
      setGuestName('');
    }
  };

  const handleSubmit = async () => {
    if (guestList.length === 0) return;
    try {
    await axios.post('/guests/group', { guests: guestList });
      navigate('/admin/guests');
    } catch (error) {
      console.error('Ошибка при сохранении группы гостей:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Добавить группу гостей</h1>

      <form onSubmit={handleAddGuest} className="flex gap-3 mb-4">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Введите имя и нажмите Enter"
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          +
        </button>
      </form>

      {guestList.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Список гостей:</h2>
          <ul className="list-decimal list-inside space-y-1 bg-gray-100 p-3 rounded">
            {guestList.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-secondary text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Сохранить группу
          </button>
        </div>
      )}
    </div>
  );
}
