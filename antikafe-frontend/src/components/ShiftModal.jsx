import { useState } from 'react';
import axios from '../../utils/axiosInstance';

const denominations = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 1];

export default function ShiftModal({ type, onClose, onSuccess }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCountChange = (denom, value) => {
    const num = parseInt(value, 10);
    setCounts((prev) => ({
      ...prev,
      [denom]: isNaN(num) ? 0 : num,
    }));
  };

  const getTotal = () => {
    return denominations.reduce((sum, d) => sum + (counts[d] || 0) * d, 0);
  };

  const handleSubmit = async () => {
    const amount = getTotal();
    setLoading(true);
    try {
      if (type === 'open') {
        await axios.post('/shift/open', { openingAmount: amount });
      } else {
        await axios.post('/shift/close', { closingAmount: amount });
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {type === 'open' ? 'Открытие смены' : 'Закрытие смены'}
        </h2>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {denominations.map((denom) => (
            <div key={denom} className="flex items-center justify-between">
              <span>{denom}₸</span>
              <input
                type="number"
                min="0"
                className="border px-3 py-1 rounded w-24 text-right"
                value={counts[denom] || ''}
                onChange={(e) => handleCountChange(denom, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 text-right font-semibold">
          Итого: {getTotal().toLocaleString()} ₸
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-primary text-white"
          >
            {loading ? 'Сохраняем...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
}
