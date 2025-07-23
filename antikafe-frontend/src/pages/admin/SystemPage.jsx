import { useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteSystemPage() {
  const [openAmount, setOpenAmount] = useState('');
  const [closeAmount, setCloseAmount] = useState('');
  const [openMessage, setOpenMessage] = useState('');
  const [closeMessage, setCloseMessage] = useState('');

  const handleOpenShift = async () => {
    try {
      const res = await axios.post('/shift/open', {
        openingAmount: parseFloat(openAmount),
      });
      setOpenMessage(res.data.message);
      setOpenAmount('');
    } catch (err) {
      setOpenMessage(err.response?.data?.message || 'Ошибка при открытии смены');
    }
  };

  const handleCloseShift = async () => {
    try {
      const res = await axios.post('/shift/close', {
        closingAmount: parseFloat(closeAmount),
      });
      setCloseMessage(res.data.message);
      setCloseAmount('');
    } catch (err) {
      setCloseMessage(err.response?.data?.message || 'Ошибка при закрытии смены');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-accent">Смена</h1>

      {/* 🔓 Открытие смены */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Открытие смены</h2>
        <input
          type="number"
          placeholder="Сумма в кассе"
          value={openAmount}
          onChange={(e) => setOpenAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
        />
        <button
          onClick={handleOpenShift}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Открыть смену
        </button>
        {openMessage && <p className="mt-2 text-sm text-green-500">{openMessage}</p>}
      </div>

      {/* 🔒 Закрытие смены */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Закрытие смены</h2>
        <input
          type="number"
          placeholder="Финальная сумма"
          value={closeAmount}
          onChange={(e) => setCloseAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
        />
        <button
          onClick={handleCloseShift}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Закрыть смену
        </button>
        {closeMessage && <p className="mt-2 text-sm text-red-400">{closeMessage}</p>}
      </div>
    </div>
  );
}
