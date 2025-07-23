import { useState } from 'react';
import axios from '../utils/axiosInstance';

export default function CloseShiftForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = async () => {
    try {
      const res = await axios.post('/shift/close', { closingAmount: parseFloat(amount) });
      setMessage(res.data.message);
      setAmount('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка при закрытии');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-3">Закрытие смены</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Финальная сумма в кассе"
        className="border px-3 py-2 rounded w-full mb-3"
      />
      <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded">
        Закрыть смену
      </button>
      {message && <p className="mt-3 text-sm text-green-500 dark:text-green-400">{message}</p>}
    </div>
  );
}
