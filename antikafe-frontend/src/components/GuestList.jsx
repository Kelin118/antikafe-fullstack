import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

export default function GuestList() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await axios.get('/guests');
        setGuests(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке гостей:', error);
      }
    };

    fetchGuests();
  }, []);

  // 🔁 Группировка гостей по groupId
  const grouped = guests.reduce((acc, guest) => {
    const group = guest.groupId || 'individual'; // одиночные гости
    if (!acc[group]) acc[group] = [];
    acc[group].push(guest);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Список гостей</h2>

      {Object.entries(grouped).map(([groupId, groupGuests], index) => (
        <div
          key={groupId}
          className="mb-4 p-4 border border-gray-300 rounded shadow bg-gray-50"
        >
          <h3 className="font-semibold text-lg mb-2">
            {groupId === 'individual'
              ? 'Индивидуальные гости'
              : `Группа #${index}`}
          </h3>

          <ul className="list-disc list-inside">
            {groupGuests.map((guest) => (
              <li key={guest._id}>{guest.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
