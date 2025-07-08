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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Бронирования на {dayjs(date).format('DD.MM.YYYY')}</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 border px-3 py-2 rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 border rounded shadow bg-white">
            <h3 className="font-semibold text-lg mb-1">{b.room}</h3>
            <p>
              ⏰ {dayjs(b.startTime).format('HH:mm')} — {dayjs(b.endTime).format('HH:mm')}
            </p>
            <p>👥 {b.groupId ? `Группа: ${b.groupId}` : b.guestNames.join(', ')}</p>
            <p className="text-sm text-gray-500">Статус: {b.status}</p>
            {b.notes && <p className="text-sm mt-1 italic">📝 {b.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
