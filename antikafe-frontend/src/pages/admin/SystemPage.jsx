import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

const denominations = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 1];

export default function SystemPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'open' | 'close'
  const [counts, setCounts] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchShiftStatus();
  }, []);

  const fetchShiftStatus = async () => {
    try {
      const res = await axios.get('/shift/status');
      setIsOpen(res.data.isOpen);
    } catch (err) {
      console.error('Ошибка при проверке смены');
    }
  };

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
    const total = getTotal();
    try {
      if (modalType === 'open') {
        await axios.post('/shift/open', { openingAmount: total });
        setMessage(`Смена открыта на сумму ${total}₸`);
      } else {
        await axios.post('/shift/close', { closingAmount: total });
        setMessage(`Смена закрыта на сумму ${total}₸`);
      }
      setModalOpen(false);
      fetchShiftStatus();
      setCounts({});
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление сменой</h1>

      <button
        onClick={() => {
          setModalType(isOpen ? 'close' : 'open');
          setModalOpen(true);
        }}
        className={`px-6 py-3 rounded text-white ${isOpen ? 'bg-red-600' : 'bg-green-600'}`}
      >
        {isOpen ? 'Закрыть смену' : 'Открыть смену'}
      </button>

      {message && <p className="mt-4 text-green-600 dark:text-green-400">{message}</p>}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'open' ? 'Открытие смены' : 'Закрытие смены'}
            </h2>

            <div className="space-y-3">
              {denominations.map((denom) => (
                <div key={denom} className="flex items-center justify-between">
                  <label>{denom} ₸</label>
                  <input
                    type="number"
                    min="0"
                    value={counts[denom] || ''}
                    onChange={(e) => handleCountChange(denom, e.target.value)}
                    className="border px-3 py-1 rounded w-24 text-right"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 text-right font-semibold">
              Итого: {getTotal().toLocaleString()} ₸
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
