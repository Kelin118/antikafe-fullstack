import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', group: '' });
  const [sortOption, setSortOption] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const token = localStorage.getItem('token');
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const g = await axios.get('/api/products/groups', headers);
      const p = await axios.get('/api/products', headers);
      setGroups(g.data);
      setProducts(p.data);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroup.trim()) return;
    try {
      await axios.post('/api/products/groups', { name: newGroup }, headers);
      setNewGroup('');
      fetchData();
    } catch (err) {
      console.error('Ошибка при добавлении группы:', err);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await axios.delete(`/api/products/groups/${id}`, headers);
      fetchData();
    } catch (err) {
      console.error('Ошибка при удалении группы:', err);
    }
  };

  const handleAddProduct = async () => {
    const { name, quantity, price, group } = newProduct;
    if (!name || !quantity || !price || !group) return;
    try {
      await axios.post('/api/products', newProduct, headers);
      setNewProduct({ name: '', quantity: '', price: '', group: '' });
      fetchData();
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, headers);
      fetchData();
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление Товарами</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Группы товаров</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Новая группа"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button onClick={handleAddGroup} className="bg-primary text-white px-4 py-2 rounded">
            Добавить
          </button>
        </div>
        <ul className="list-disc pl-5">
          {groups.map((group) => (
            <li key={group._id} className="flex justify-between items-center">
              {group.name}
              <button onClick={() => handleDeleteGroup(group._id)} className="text-red-600 ml-4">
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Добавить товар</h2>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Название"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Количество"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Цена"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={newProduct.group}
            onChange={(e) => setNewProduct({ ...newProduct, group: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="">Выбрать группу</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddProduct} className="mt-4 bg-secondary text-white px-6 py-2 rounded">
          Добавить товар
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Сортировка:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="name">По имени</option>
            <option value="quantity">По количеству</option>
            <option value="price">По цене</option>
          </select>
        </div>

        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="border rounded px-2 py-1 text-sm"
        >
          {sortDirection === 'asc' ? '▲ Возрастание' : '▼ Убывание'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Список товаров</h2>
        {groups.map((group) => {
          const groupProducts = products
            .filter((product) => product.group === group._id)
            .sort((a, b) => {
              let result = 0;
              if (sortOption === 'name') {
                result = a.name.localeCompare(b.name);
              } else if (sortOption === 'quantity') {
                result = a.quantity - b.quantity;
              } else if (sortOption === 'price') {
                result = a.price - b.price;
              }
              return sortDirection === 'asc' ? result : -result;
            });

          return (
            <div key={group._id} className="mb-4">
              <h3 className="text-lg font-bold text-primary mb-2">{group.name}</h3>
              {groupProducts.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {groupProducts.map((product) => (
                    <li key={product._id} className="flex justify-between items-center">
                      {product.name} — {product.quantity} шт — {product.price}₸
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 ml-4"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 ml-4">Нет товаров в этой группе.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
