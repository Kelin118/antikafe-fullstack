import { useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ здесь важное исправление

export default function AddGuestForm({ onGuestAdded }) {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post('/guests', { name }); // ⚠️ Убери localhost, используй относительный путь
      setName('');
      onGuestAdded?.(); // Добавь проверку, если onGuestAdded не передан
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
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="bg-accent text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
      >
        Добавить
      </button>
    </form>
  );
}
