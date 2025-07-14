// src/pages/site/SiteBookingPage.jsx
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ groupName: '', date: '', time: '' });

  const companyId = localStorage.getItem('companyId');

  const fetchBookings = async () => {
    const res = await axios.get(`/bookings?companyId=${companyId}`);
    setBookings(res.data);
  };

  const handleAddBooking = async () => {
    const { groupName, date, time } = newBooking;
    if (!groupName || !date || !time) return;

    try {
      await axios.post('/bookings', { ...newBooking, companyId });
      setNewBooking({ groupName: '', date: '', time: '' });
      fetchBookings();
    } catch (error) {
      console.error('Ошибка при добавлении брони:', error);
    }
  };

  useEffect(() => {
    if (companyId) fetchBookings();
  }, [companyId]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-6">Бронирования</h1>

      {/* ➕ Добавление новой брони */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Добавить бронирование</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Название группы"
            value={newBooking.groupName}
            onChange={(e) => setNewBooking({ ...newBooking, groupName: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={newBooking.date}
            onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={newBooking.time}
            onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleAddBooking}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Добавить
          </button>
        </div>
      </div>

      {/* 📋 Таблица бронирований */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Группа</th>
              <th className="text-left px-4 py-2 border">Дата</th>
              <th className="text-left px-4 py-2 border">Время</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{b.groupName}</td>
                <td className="px-4 py-2 border">{b.date}</td>
                <td className="px-4 py-2 border">{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="text-center py-4 text-gray-500">Бронирований пока нет.</p>
        )}
      </div>
    </div>
  );
}
