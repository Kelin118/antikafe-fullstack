import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteFinancePage() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get('/shift/all'); // ⚠️ Добавим этот маршрут в backend
      setShifts(res.data);
    } catch (err) {
      console.error('Ошибка загрузки смен:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Финансовая история смен</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2">Дата открытия</th>
              <th className="px-4 py-2">Кассир</th>
              <th className="px-4 py-2">На начало</th>
              <th className="px-4 py-2">Изъятие</th>
              <th className="px-4 py-2">На конец</th>
              <th className="px-4 py-2">Карта (система)</th>
              <th className="px-4 py-2">Карта (введено)</th>
              <th className="px-4 py-2">Расхождение</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift._id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{new Date(shift.openedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{shift.cashierId?.name || '—'}</td>
                <td className="px-4 py-2">{shift.openingAmount?.toLocaleString()} ₸</td>
                <td className="px-4 py-2 text-red-600">{shift.cashWithdrawal?.toLocaleString() || 0} ₸</td>
                <td className="px-4 py-2">{shift.closingAmount?.toLocaleString() || '—'} ₸</td>
                <td className="px-4 py-2">{shift.cardAmountCalculated?.toLocaleString() || 0} ₸</td>
                <td className="px-4 py-2">{shift.cardAmountEntered?.toLocaleString() || 0} ₸</td>
                <td className="px-4 py-2 text-sm">
                  {shift.cardMismatch > 0
                    ? `+${shift.cardMismatch.toLocaleString()} ₸`
                    : shift.cardMismatch < 0
                    ? `${shift.cardMismatch.toLocaleString()} ₸`
                    : '0 ₸'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
