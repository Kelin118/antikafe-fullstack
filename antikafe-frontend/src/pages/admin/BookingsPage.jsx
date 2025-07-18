import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import dayjs from 'dayjs';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/bookings?date=${date}`);
      setBookings(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке бронирований:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [date]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Бронирования</h1>
        <p className="text-sm text-gray-600">Выберите дату и просмотрите текущие бронирования.</p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6">
        <label className="block text-secondary font-medium mb-2">Дата</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div key={b._id} className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-xl font-semibold text-secondary mb-2">{b.room}</h3>
            <p className="text-gray-700 mb-1">
              ⏰ {dayjs(b.startTime).format('HH:mm')} — {dayjs(b.endTime).format('HH:mm')}
            </p>
            <p className="text-gray-700 mb-1">
              👥 {b.groupId ? `Группа: ${b.groupId}` : b.guestNames.join(', ')}
            </p>
            <p className="text-sm text-gray-500 mb-1">Статус: {b.status}</p>
            {b.notes && <p className="text-sm italic text-gray-600">📝 {b.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
