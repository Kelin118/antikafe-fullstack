import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import axios from '../utils/axiosInstance';

const denominations = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 1];

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [message, setMessage] = useState('');

  const cards = [
    { title: 'Гости', path: '/admin/guests', icon: '🧑‍🤝‍🧑' },
    { title: 'Бронирования', path: '/admin/bookings', icon: '📅' },
    { title: 'Сотрудники', path: '/admin/employees', icon: '👨‍💼' },
    { title: 'Товары', path: '/admin/products', icon: '🛍️' },
    { title: 'Система', path: '/admin/system', icon: '⚙️' },
  ];

  const isDashboard = location.pathname === '/admin';

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/shift/status');
      setIsOpen(res.data.isOpen);
    } catch (err) {
      console.error('Ошибка получения статуса смены');
    }
  };

  const getTotal = () => {
    return denominations.reduce((sum, d) => sum + (counts[d] || 0) * d, 0);
  };

  const handleCountChange = (denom, value) => {
    const num = parseInt(value, 10);
    setCounts((prev) => ({
      ...prev,
      [denom]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSubmit = async () => {
    const total = getTotal();
    try {
      await axios.post('/shift/open', {
        openingAmount: total,
        openingDenominations: counts,
      });
      setMessage(`Смена успешно открыта на сумму ${total} ₸`);
      setModalOpen(false);
      fetchStatus();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка открытия смены');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {isDashboard ? (
        <>
          <h1 className="text-3xl font-bold text-primary mb-10 text-center">Панель администратора</h1>

          {!isOpen && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow"
              >
                Открыть смену
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cards.map(({ title, path, icon }) => (
              <Card
                key={path}
                onClick={() => navigate(path)}
                className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4">{icon}</div>
                  <h2 className="text-xl font-semibold text-secondary dark:text-white">{title}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Outlet />
      )}

      {/* Модалка открытия смены */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Открытие смены</h2>

            <div className="space-y-3">
              {denominations.map((denom, index) => (
                <div key={denom} className="flex items-center justify-between">
                  <label>{denom} ₸</label>
                  <input
                    type="number"
                    min="0"
                    value={counts[denom] || ''}
                    onChange={(e) => handleCountChange(denom, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const next = inputRefs.current[index + 1];
                        if (next) next.focus();
                      }
                    }}
                    ref={(el) => (inputRefs.current[index] = el)}
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

            {message && (
              <p className="mt-4 text-green-600 dark:text-green-400 text-center">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
