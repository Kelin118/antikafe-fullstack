import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axiosInstance';

export default function AddGuestForm({ onGuestAdded }) {
  const [name, setName] = useState('');
  const [paymentType, setPaymentType] = useState('cash');
  const [discount, setDiscount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      paymentType,
      discount: parseFloat(discount) || 0,
    };

    if (paymentType === 'mixed') {
      payload.cashAmount = parseFloat(cashAmount) || 0;
      payload.cardAmount = parseFloat(cardAmount) || 0;
    }

    try {
      await axios.post('/guests', payload);

      // Сброс формы
      setName('');
      setPaymentType('cash');
      setDiscount('');
      setCashAmount('');
      setCardAmount('');
      onGuestAdded?.();
      nameRef.current?.focus();
    } catch (error) {
      console.error('Ошибка при добавлении гостя:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Имя гостя"
        value={name}
        ref={nameRef}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />

      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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
            min="0"
            onChange={(e) => setCashAmount(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Карта"
            value={cardAmount}
            min="0"
            onChange={(e) => setCardAmount(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
        </div>
      )}

      <input
        type="number"
        placeholder="Скидка (в тенге)"
        value={discount}
        min="0"
        onChange={(e) => setDiscount(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />

      <button
        type="submit"
        className="bg-accent text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition w-full"
      >
        Добавить гостя
      </button>
    </form>
  );
}
