// 🔧 Обновлённый компонент SiteProductsPage с редактированием, фильтрацией, сортировкой и экспортом
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { Dialog } from '@headlessui/react';

export default function SiteProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', price: '', groupId: '', description: '' });

  const [editingProduct, setEditingProduct] = useState(null);
  const [filterGroup, setFilterGroup] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

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

  const handleGroupDelete = async (id) => {
    if (confirm('Удалить эту группу?')) {
      await axios.delete(`/products/groups/${id}`);
      fetchAll();
    }
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
      alert('Ошибка: ' + (err.response?.data?.error || 'Неизвестная ошибка'));
    }
  };

  const handleProductDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      await axios.delete(`/products/${id}`);
      fetchAll();
    }
  };

  const handleProductUpdate = async () => {
    const { _id, name, stock, price, groupId, description } = editingProduct;
    await axios.put(`/products/${_id}`, {
      name,
      stock: Number(stock),
      price: Number(price),
      groupId,
      description,
    });
    setEditingProduct(null);
    fetchAll();
  };

  const handleExportCSV = () => {
    const rows = [['Название', 'Группа', 'Цена', 'Остаток']];
    products.forEach(p => {
      if (!filterGroup || p.groupId?._id === filterGroup || p.groupId === filterGroup) {
        const groupName = groups.find(g => g._id === (p.groupId?._id || p.groupId))?.name || '-';
        rows.push([p.name, groupName, p.price, p.stock]);
      }
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const sortedFilteredProducts = [...products]
    .filter(p => !filterGroup || p.groupId === filterGroup || p.groupId?._id === filterGroup)
    .sort((a, b) => {
      if (!sortKey) return 0;
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-6">Управление товарами</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">Создать группу</h2>
          <div className="flex gap-2">
            <input value={newGroup} onChange={e => setNewGroup(e.target.value)} placeholder="Новая группа" className="border px-4 py-2 rounded w-full" />
            <button onClick={handleGroupAdd} className="bg-primary text-white px-4 rounded">Добавить</button>
          </div>
          <ul className="mt-4 space-y-2">
            {groups.map(g => (
              <li key={g._id} className="flex justify-between items-center">
                <span>{g.name}</span>
                <button onClick={() => handleGroupDelete(g._id)} className="text-red-500">Удалить</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">Добавить товар</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Название" className="border px-2 py-1 rounded" />
            <input value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Остаток" type="number" className="border px-2 py-1 rounded" />
            <input value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Цена" type="number" className="border px-2 py-1 rounded" />
            <select value={newProduct.groupId} onChange={e => setNewProduct({ ...newProduct, groupId: e.target.value })} className="border px-2 py-1 rounded">
              <option value="">Выбери группу</option>
              {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
            <input value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Описание" className="border px-2 py-1 rounded" />
          </div>
          <button onClick={handleProductAdd} className="mt-4 bg-primary text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">Все группы</option>
          {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <button onClick={handleExportCSV} className="bg-secondary text-white px-4 py-2 rounded">📥 Экспорт CSV</button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort('name')}>Название</th>
              <th className="px-4 py-2">Группа</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort('price')}>Цена</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort('stock')}>Остаток</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredProducts.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{groups.find(g => g._id === (p.groupId?._id || p.groupId))?.name || '-'}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => setEditingProduct(p)} className="text-blue-500 mr-3">✏️</button>
                  <button onClick={() => handleProductDelete(p._id)} className="text-red-500">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* МОДАЛКА РЕДАКТИРОВАНИЯ */}
      <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)} className="fixed inset-0 z-50 flex items-center justify-center">
        {editingProduct && (
          <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
            <Dialog.Title className="text-xl font-bold mb-4">Редактировать товар</Dialog.Title>
            <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="Название" className="w-full border px-3 py-2 rounded mb-2" />
            <input value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} type="number" placeholder="Остаток" className="w-full border px-3 py-2 rounded mb-2" />
            <input value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} type="number" placeholder="Цена" className="w-full border px-3 py-2 rounded mb-2" />
            <select value={editingProduct.groupId} onChange={e => setEditingProduct({ ...editingProduct, groupId: e.target.value })} className="w-full border px-3 py-2 rounded mb-2">
              {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
            <input value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} placeholder="Описание" className="w-full border px-3 py-2 rounded mb-4" />
            <button onClick={handleProductUpdate} className="bg-primary text-white px-4 py-2 rounded w-full">Сохранить</button>
          </Dialog.Panel>
        )}
      </Dialog>
    </div>
  );
}
