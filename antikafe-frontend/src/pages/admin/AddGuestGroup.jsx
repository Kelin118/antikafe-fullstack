import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AddGuestsAndProducts() {
  const [guestName, setGuestName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [discount, setDiscount] = useState('');
  const [paymentType, setPaymentType] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');

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

    const payload = {
      guests: guestList,
      paymentType,
      discount: parseFloat(discount) || 0,
    };

    if (paymentType === 'mixed') {
      payload.cashAmount = parseFloat(cashAmount) || 0;
      payload.cardAmount = parseFloat(cardAmount) || 0;
    }

    try {
      await axios.post('/guests/group', payload);
      setGuestList([]);
      setDiscount('');
      setCashAmount('');
      setCardAmount('');
      setPaymentType('cash');
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
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Способ оплаты:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
                <option value="mixed">Смешанная</option>
              </select>
            </div>

            {paymentType === 'mixed' && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Наличные"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Карта"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  className="border px-4 py-2 rounded"
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
