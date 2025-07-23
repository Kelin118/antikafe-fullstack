import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function ShiftHistoryPage() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/shift/all')
      .then(res => setShifts(res.data))
      .catch(() => setShifts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">История смен</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : shifts.length === 0 ? (
        <p>Смен пока нет.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3">Дата открытия</th>
                <th className="p-3">Кассир</th>
                <th className="p-3">Сумма на начало</th>
                <th className="p-3">Сумма на конец</th>
                <th className="p-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift._id} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="p-3">{new Date(shift.openedAt).toLocaleString()}</td>
                  <td className="p-3">{shift.cashier?.name || '—'}</td>
                  <td className="p-3">{shift.openingAmount?.toLocaleString()} ₸</td>
                  <td className="p-3">
                    {shift.isOpen ? '—' : (shift.closingAmount?.toLocaleString() + ' ₸')}
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${shift.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                      {shift.isOpen ? 'Открыта' : 'Закрыта'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
