import { useState } from 'react';
import axios from '../utils/axiosInstance';

export default function OpenShiftForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleOpen = async () => {
    try {
      const res = await axios.post('/shift/open', { openingAmount: parseFloat(amount) });
      setMessage(res.data.message);
      setAmount('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <h2 className="text-xl font-bold mb-3">Открытие смены</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Сумма в кассе"
        className="border px-3 py-2 rounded w-full mb-3"
      />
      <button onClick={handleOpen} className="bg-primary text-white px-4 py-2 rounded">
        Открыть смену
      </button>
      {message && <p className="mt-3 text-sm text-green-500 dark:text-green-400">{message}</p>}
    </div>
  );
}
