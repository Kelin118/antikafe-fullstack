import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { Dialog } from '@headlessui/react';

export default function AddGuestsAndProducts() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [products, setProducts] = useState([]);

  const [guests, setGuests] = useState([]);
  const [selectedGuestIndex, setSelectedGuestIndex] = useState(null);

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await axios.get('/products/groups');
      setGroups(res.data);
      if (res.data[0]) setSelectedGroupId(res.data[0]._id);
    };
    const fetchProducts = async () => {
      const res = await axios.get('/products');
      setProducts(res.data);
    };
    fetchGroups();
    fetchProducts();
  }, []);

  const addGuest = () => {
    if (!newGuestName.trim()) return;
    setGuests([...guests, { name: newGuestName.trim(), products: [] }]);
    setNewGuestName('');
    setIsGuestModalOpen(false);
  };

  const addProductToGuest = (product) => {
    if (selectedGuestIndex === null) return alert('Выберите гостя');
    const updatedGuests = [...guests];
    updatedGuests[selectedGuestIndex].products.push(product);
    setGuests(updatedGuests);
  };

  const totalSum = guests.reduce((sum, g) =>
    sum + g.products.reduce((pSum, p) => pSum + p.price, 0)
  , 0);

  const handleSaveGuests = async () => {
    try {
      const payload = {
        guests: guests.map(g => ({
          name: g.name,
          products: g.products.map(p => p._id)
        }))
      };
      await axios.post('/guests/group', payload);
      alert('Гости сохранены!');
      setGuests([]);
    } catch (err) {
      console.error('Ошибка сохранения гостей:', err);
    }
  };

  const handlePayment = async () => {
    try {
      const payload = {
        guests: guests.map(g => ({
          name: g.name,
          products: g.products.map(p => p._id)
        })),
        paymentType,
        ...(paymentType === 'mixed' && {
          cashAmount: parseFloat(cashAmount) || 0,
          cardAmount: parseFloat(cardAmount) || 0
        })
      };
      await axios.post('/guests/group', payload);
      alert('Оплата проведена!');
      setGuests([]);
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error('Ошибка оплаты:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Товары — 2/3 */}
      <div className="col-span-2 bg-white rounded shadow p-4 h-full">
        <h2 className="text-lg font-semibold mb-2">📦 Группы товаров</h2>
        <div className="flex gap-4">
          <div className="w-1/4 border-r pr-4">
            <ul className="space-y-2">
              {groups.map(g => (
                <li key={g._id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${g._id === selectedGroupId ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setSelectedGroupId(g._id)}
                  >
                    {g.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-3/4 grid grid-cols-2 gap-4">
            {products
              .filter(p => {
                const groupId = typeof p.groupId === 'object' ? p.groupId._id : p.groupId;
                return groupId === selectedGroupId;
              })
              .map(p => (
                <div key={p._id} className="border p-2 rounded shadow-sm">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.price} ₸</div>
                  <button
                    onClick={() => addProductToGuest(p)}
                    className="mt-2 w-full bg-green-500 text-white py-1 rounded"
                  >
                    ➕ Добавить
                  </button>
                </div>
              ))}
            {products.filter(p => {
              const groupId = typeof p.groupId === 'object' ? p.groupId._id : p.groupId;
              return groupId === selectedGroupId;
            }).length === 0 && (
              <div className="text-gray-400 col-span-2">Нет товаров в этой группе</div>
            )}
          </div>
        </div>
      </div>

      {/* Гости — 1/3 */}
      <div className="col-span-1 bg-white rounded shadow p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">👥 Гости</h2>
            <button
              onClick={() => setIsGuestModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Добавить гостя
            </button>
          </div>
          {guests.length === 0 && <p className="text-gray-500">Гости не добавлены</p>}
          {guests.map((g, index) => (
            <div
              key={index}
              onClick={() => setSelectedGuestIndex(index)}
              className={`p-3 rounded mb-3 cursor-pointer border ${selectedGuestIndex === index ? 'border-blue-500 bg-blue-50' : 'bg-gray-50'}`}
            >
              <div className="font-semibold">{g.name}</div>
              {g.products.length > 0 && (
                <ul className="text-sm list-disc list-inside text-gray-700">
                  {g.products.map((p, idx) => (
                    <li key={idx}>{p.name} — {p.price} ₸</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {guests.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="font-bold text-xl">Итого: {totalSum} ₸</div>
            <button
              onClick={handleSaveGuests}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              💾 Сохранить
            </button>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full bg-secondary text-white py-2 rounded"
            >
              💳 Принять оплату
            </button>
          </div>
        )}
      </div>

      {/* Модалка: добавить гостя */}
      <Dialog open={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Добавить гостя</Dialog.Title>
          <input
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Имя гостя"
            className="w-full border px-4 py-2 rounded mb-4"
          />
          <button onClick={addGuest} className="bg-primary text-white px-4 py-2 rounded w-full">Добавить</button>
        </Dialog.Panel>
      </Dialog>

      {/* Модалка: оплата */}
      <Dialog open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Выберите способ оплаты</Dialog.Title>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
          >
            <option value="cash">Наличные</option>
            <option value="card">Карта</option>
            <option value="mixed">Смешанная</option>
          </select>
          {paymentType === 'mixed' && (
            <div className="grid grid-cols-2 gap-4 mb-4">
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
          <button onClick={handlePayment} className="bg-secondary text-white w-full py-2 rounded">
            Подтвердить оплату
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
