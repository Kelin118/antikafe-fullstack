import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteFinancePage() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get('/shift/all');
      setShifts(res.data);
    } catch (err) {
      console.error('Ошибка загрузки смен:', err);
    }
  };

  // Подсчёты:
  const totalCashRevenue = shifts.reduce((sum, s) => sum + (s.closingAmount || 0) - (s.openingAmount || 0), 0);
  const totalCardRevenue = shifts.reduce((sum, s) => sum + (s.cardAmountEntered || 0), 0);
  const totalWithdrawals = shifts.reduce((sum, s) => sum + (s.cashWithdrawal || 0), 0);
  const totalMismatch = shifts.reduce((sum, s) => sum + (s.cardMismatch || 0), 0);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📊 Финансовая сводка</h2>

      {/* 📦 Выручка */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">💰 Выручка</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800 dark:text-white">
          <div>Наличные: <strong>{totalCashRevenue.toLocaleString()} ₸</strong></div>
          <div>Карта: <strong>{totalCardRevenue.toLocaleString()} ₸</strong></div>
          <div>Изъято: <strong className="text-red-500">{totalWithdrawals.toLocaleString()} ₸</strong></div>
          <div>Расхождение по карте: <strong>{totalMismatch > 0 ? '+' : ''}{totalMismatch.toLocaleString()} ₸</strong></div>
        </div>
      </div>

      {/* 🧾 Таблица по сменам */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">📅 История смен</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
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
                <tr key={shift._id} className="border-t">
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
    </div>
  );
}
