
import { useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function AddGuestsAndProducts() {
  const [guestName, setGuestName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [paymentType, setPaymentType] = useState('cash');
  const [discount, setDiscount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (guestName.trim()) {
      setGuestList([...guestList, guestName.trim()]);
      setGuestName('');
    }
  };

  const handleSubmitGuests = async () => {
    if (guestList.length === 0) return;
    try {
      await axios.post('/guests/group', {
        guests: guestList,
        paymentType,
        discount: parseFloat(discount) || 0,
        cashAmount: paymentType === 'mixed' ? parseFloat(cashAmount) || 0 : undefined,
        cardAmount: paymentType === 'mixed' ? parseFloat(cardAmount) || 0 : undefined,
      });
      setGuestList([]);
      setPaymentType('cash');
      setDiscount('');
      setCashAmount('');
      setCardAmount('');
    } catch (error) {
      console.error('Ошибка при сохранении группы гостей:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border">
      <h2 className="text-xl font-bold text-primary mb-4">👥 Добавить гостей</h2>

      <form onSubmit={handleAddGuest} className="space-y-4">
        <input
          type="text"
          placeholder="Имя гостя"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="cash">Наличные</option>
          <option value="card">Карта</option>
          <option value="mixed">Смешанная</option>
        </select>

        {paymentType === 'mixed' && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Наличные"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
            <input
              type="number"
              placeholder="Карта"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
          </div>
        )}

        <input
          type="number"
          placeholder="Скидка (в тенге)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-primary text-white px-5 py-2 rounded hover:bg-green-700 transition w-full"
        >
          Добавить в список
        </button>
      </form>

      {guestList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-secondary">Список гостей:</h3>
          <ul className="list-disc list-inside mb-4 bg-gray-100 p-3 rounded">
            {guestList.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
          <button
            onClick={handleSubmitGuests}
            className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-800 transition w-full"
          >
            Сохранить группу
          </button>
        </div>
      )}
    </div>
  );
}
