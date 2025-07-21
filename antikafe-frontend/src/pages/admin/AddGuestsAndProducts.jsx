
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AddGuestsAndProducts() {
  const [guestName, setGuestName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '', stock: '', price: '', groupId: '', description: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('/products/groups');
        setGroups(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке групп:', err);
      }
    };
    fetchGroups();
  }, []);

  const handleAddGuest = (e) => {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (trimmed) {
      setGuestList([...guestList, trimmed]);
      setGuestName('');
    }
  };

  const handleSubmitGuests = async () => {
    if (!guestList.length) return;
    try {
      await axios.post('/guests/group', { guests: guestList });
      setGuestList([]);
      alert('Гости добавлены');
    } catch (err) {
      console.error('Ошибка при добавлении гостей:', err);
    }
  };

  const handleAddProduct = async () => {
    const { name, stock, price, groupId, description } = newProduct;
    if (!name.trim() || !groupId || !price) return;

    try {
      await axios.post('/products', {
        name,
        stock: Number(stock),
        price: Number(price),
        groupId,
        description
      });
      setNewProduct({ name: '', stock: '', price: '', groupId: '', description: '' });
      alert('Товар добавлен');
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err.response?.data || err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-xl shadow p-6 border">
        <h2 className="text-xl font-bold text-primary mb-4">👥 Добавить гостей</h2>
        <form onSubmit={handleAddGuest} className="flex gap-3 mb-4">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Имя гостя и Enter"
            className="flex-1 px-4 py-2 border rounded focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            +
          </button>
        </form>

        {guestList.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-secondary">Список гостей:</h3>
            <ul className="list-disc list-inside mb-4 bg-gray-100 p-3 rounded">
              {guestList.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
            <button
              onClick={handleSubmitGuests}
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-800 transition"
            >
              Сохранить группу
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 border">
        <h2 className="text-xl font-bold text-primary mb-4">🛒 Добавить товар</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Название товара"
            className="border px-4 py-2 rounded"
          />
          <input
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            placeholder="Остаток"
            type="number"
            className="border px-4 py-2 rounded"
          />
          <input
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Цена"
            type="number"
            className="border px-4 py-2 rounded"
          />
          <select
            value={newProduct.groupId}
            onChange={(e) => setNewProduct({ ...newProduct, groupId: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="">Выбери группу</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Описание"
            className="border px-4 py-2 rounded"
          />
          <button
            onClick={handleAddProduct}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Добавить товар
          </button>
        </div>
      </div>
    </div>
  );
}
