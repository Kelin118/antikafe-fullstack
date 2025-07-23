import { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axiosInstance';

const denominations = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 1];

export default function SystemPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'close'
  const [counts, setCounts] = useState({});
  const [terminalAmount, setTerminalAmount] = useState('');
  const [cardMismatch, setCardMismatch] = useState(null);
  const [message, setMessage] = useState('');
  const [lastShift, setLastShift] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    fetchShiftStatus();
    fetchLastShift();
  }, []);

  const fetchShiftStatus = async () => {
    try {
      const res = await axios.get('/shift/status');
      setIsOpen(res.data.isOpen);
    } catch (err) {
      console.error('Ошибка при проверке смены');
    }
  };

  const fetchLastShift = async () => {
    try {
      const res = await axios.get('/shift/last');
      setLastShift(res.data);
    } catch {
      setLastShift(null);
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

  const handleCloseShift = async () => {
    const totalCash = getTotal();
    const expectedCard = (lastShift?.closingAmount || 0) - totalCash;
    const terminal = parseFloat(terminalAmount || '0');
    const diff = terminal - expectedCard;

    if (!terminalAmount || isNaN(terminal)) {
      setModalOpen(true);
      return;
    }

    if (Math.abs(diff) > 1) {
      setCardMismatch(diff);
      setModalOpen(true);
      return;
    }

    // Если всё верно — отправляем запрос
    try {
      await axios.post('/shift/close', {
        closingAmount: totalCash + terminal,
        closingDenominations: counts,
      });
      setMessage(`Смена успешно закрыта`);
      setModalOpen(false);
      setCounts({});
      setTerminalAmount('');
      setCardMismatch(null);
      fetchShiftStatus();
      fetchLastShift();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка закрытия');
    }
  };

  return (
    <div className="p-6">
      {lastShift && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow text-sm">
          <h2 className="text-lg font-bold mb-2">Последняя смена</h2>
          <p>📅 Открыта: {new Date(lastShift.openedAt).toLocaleString()}</p>
          <p>💵 Сумма при открытии: <b>{lastShift.openingAmount?.toLocaleString()} ₸</b></p>
          {lastShift.closedAt ? (
            <>
              <p>🕓 Закрыта: {new Date(lastShift.closedAt).toLocaleString()}</p>
              <p>💰 Сумма при закрытии: <b>{lastShift.closingAmount?.toLocaleString()} ₸</b></p>
            </>
          ) : (
            <p className="text-yellow-600 font-semibold">Смена ещё не закрыта</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Блок Наличные */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Оплата наличными</h3>
          <p>💵 Сумма на начало смены: <b>{lastShift?.openingAmount?.toLocaleString()} ₸</b></p>
          <p>💰 Изъятие наличных: <b className="text-red-600">0 ₸</b></p>
          <p>🔐 Сумма на конец смены: <b>{getTotal().toLocaleString()} ₸</b></p>
          <button
            onClick={() => {
              setModalType('close');
              setModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded bg-primary text-white"
          >
            Указать номиналы
          </button>
        </div>

        {/* Блок Картой */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Оплата картой</h3>
          <p>💳 Сумма по карте (расчёт): <b>{((lastShift?.closingAmount || 0) - getTotal()).toLocaleString()} ₸</b></p>
          <div className="mt-2">
            <label className="block mb-1 text-sm">Введено с терминала:</label>
            <input
              type="number"
              value={terminalAmount}
              onChange={(e) => setTerminalAmount(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              placeholder="Введите сумму по терминалу"
            />
          </div>
        </div>
      </div>

      {cardMismatch !== null && (
        <div className="mt-2 text-center text-sm text-red-500 border-t pt-2">
          ⚠️ Расхождение по карте: {cardMismatch > 0 ? `излишек ${cardMismatch}₸` : `недостача ${Math.abs(cardMismatch)}₸`}
        </div>
      )}

      {message && <p className="mt-4 text-green-600 dark:text-green-400">{message}</p>}

      <div className="flex justify-end mt-8">
        <button
          onClick={handleCloseShift}
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          Закрыть смену
        </button>
      </div>

      {/* Модальное окно номиналов */}
      {modalOpen && modalType === 'close' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Ввод номиналов</h2>

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

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded"
              >
                Отмена
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Сохранить номиналы
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
