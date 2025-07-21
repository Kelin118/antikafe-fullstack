
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function SiteProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', price: '', groupId: '', description: '' });

  const fetchAll = async () => {
    const [productRes, groupRes] = await Promise.all([
      axios.get('/products'),
      axios.get('/products/groups'),
    ]);
    setProducts(productRes.data);
    setGroups(groupRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleGroupAdd = async () => {
    if (!newGroup.trim()) return;
    await axios.post('/products/groups', { name: newGroup });
    setNewGroup('');
    fetchAll();
  };

  const handleProductAdd = async () => {
  const { name, stock, price, groupId, description } = newProduct;
  if (!name.trim() || !groupId || !price) return;

  try {
    await axios.post('/products', {
      name,
      stock: Number(stock),
      price: Number(price),
      groupId,
      description,
    });
    setNewProduct({ name: '', stock: '', price: '', groupId: '', description: '' });
    fetchAll();
  } catch (err) {
    console.error('❌ Ошибка при создании товара:', err.response?.data || err.message);
    alert('Ошибка: ' + (err.response?.data?.error || 'Неизвестная ошибка'));
  }
};


  const handleProductDelete = async (id) => {
    await axios.delete(`/products/${id}`);
    fetchAll();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-6">Управление товарами</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Создать группу товаров</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Название группы"
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleGroupAdd}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition w-full md:w-auto"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Добавить товар</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Название"
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
        </div>
        <button
          onClick={handleProductAdd}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Добавить товар
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Название</th>
              <th className="px-4 py-2 border text-left">Группа</th>
              <th className="px-4 py-2 border text-left">Цена</th>
              <th className="px-4 py-2 border text-left">Остаток</th>
              <th className="px-4 py-2 border text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.groupId?.name}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleProductDelete(p._id)}
                    className="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-4 text-gray-500">Товары пока не добавлены.</p>
        )}
      </div>
    </div>
  );
}
