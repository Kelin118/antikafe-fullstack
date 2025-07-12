// src/pages/admin/ProductsPage.jsx
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', group: '', description: '' });

  const companyId = localStorage.getItem('companyId');

  const fetchAll = async () => {
    const [productRes, groupRes] = await Promise.all([
      axios.get(`/products?companyId=${companyId}`),
      axios.get(`/products/groups?companyId=${companyId}`),
    ]);
    setProducts(productRes.data);
    setGroups(groupRes.data);
  };

  useEffect(() => {
    if (companyId) fetchAll();
  }, [companyId]);

  const handleGroupAdd = async () => {
    if (!newGroup.trim()) return;
    await axios.post('/products/groups', { name: newGroup, companyId });
    setNewGroup('');
    fetchAll();
  };

  const handleProductAdd = async () => {
    const { name, quantity, price, group, description } = newProduct;
    if (!name.trim() || !group || !price) return;
    await axios.post('/products', { name, quantity, price, group, description, companyId });
    setNewProduct({ name: '', quantity: '', price: '', group: '', description: '' });
    fetchAll();
  };

  const handleProductDelete = async (id) => {
    await axios.delete(`/products/${id}`);
    fetchAll();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Управление товарами</h1>

      {/* Добавить группу */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Создать группу товаров</h2>
        <div className="flex gap-2">
          <input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Название группы"
            className="border rounded px-3 py-2 w-64"
          />
          <button onClick={handleGroupAdd} className="bg-primary text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </div>

      {/* Добавить товар */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Добавить товар</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Название" className="border px-2 py-1 rounded" />
          <input value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} placeholder="Остаток" type="number" className="border px-2 py-1 rounded" />
          <input value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Цена" type="number" className="border px-2 py-1 rounded" />
          <select value={newProduct.group} onChange={(e) => setNewProduct({ ...newProduct, group: e.target.value })} className="border px-2 py-1 rounded">
            <option value="">Выбери группу</option>
            {groups.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Описание" className="border px-2 py-1 rounded" />
        </div>
        <button onClick={handleProductAdd} className="mt-2 bg-primary text-white px-4 py-2 rounded">Добавить товар</button>
      </div>

      {/* Таблица товаров */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Список товаров</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Название</th>
              <th className="border px-2 py-1">Группа</th>
              <th className="border px-2 py-1">Цена</th>
              <th className="border px-2 py-1">Остаток</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">{p.group?.name}</td>
                <td className="border px-2 py-1">{p.price}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleProductDelete(p._id)} className="text-red-500 hover:underline">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
