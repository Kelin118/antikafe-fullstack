import { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    guestName: '',
    date: '',
    startTime: '',
    duration: '',
    room: '',
  });

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings', headers);
      setBookings(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке броней:', err);
    }
  };

  const handleAddBooking = async () => {
    const { guestName, date, startTime, duration, room } = form;
    if (!guestName || !date || !startTime || !duration || !room) return;

    try {
      const startTime = new Date(`${form.date}T${form.startTime}`);
      const endTime = new Date(startTime.getTime() + form.duration * 60000);

      await axios.post('/api/bookings', {
        room: form.room,
        startTime,
        endTime,
        guestNames: [form.guestName],
      }, headers);
      setForm({ guestName: '', date: '', startTime: '', duration: '', room: '' });
      fetchBookings();
    } catch (err) {
      console.error('Ошибка при добавлении брони:', err);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`, headers);
      fetchBookings();
    } catch (err) {
      console.error('Ошибка при удалении брони:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Бронирование</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Добавить бронь</h2>
        <div className="grid grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Имя гостя"
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Длительность (мин)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="">Выбери комнату</option>
            <option value="VIP">VIP</option>
            <option value="Обычная">Обычная</option>
          </select>
        </div>
        <button
          onClick={handleAddBooking}
          className="mt-4 bg-primary text-white px-6 py-2 rounded"
        >
          Забронировать
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Список броней</h2>
        <ul className="space-y-2">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <strong>{booking.guestName}</strong> — {booking.date} {booking.startTime}, {booking.duration} мин, {booking.room}
              </div>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="text-red-600"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
