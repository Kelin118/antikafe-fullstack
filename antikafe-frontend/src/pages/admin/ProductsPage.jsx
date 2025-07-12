// src/pages/admin/ProductsPage.jsx
import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, groupRes] = await Promise.all([
          axios.get(`/products?companyId=${companyId}`),
          axios.get(`/products/groups?companyId=${companyId}`),
        ]);
        setProducts(productRes.data);
        setGroups(groupRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    };

    if (companyId) fetchData();
  }, [companyId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Список товаров</h1>

      <input
        type="text"
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full md:w-1/2"
      />

      {groups.map((group) => {
        const groupProducts = filteredProducts.filter(p => p.group?._id === group._id);
        if (groupProducts.length === 0) return null;

        return (
          <div key={group._id} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{group.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {groupProducts.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 shadow">
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="mt-1">Цена: <strong>{product.price}₸</strong></p>
                  <p>Остаток: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 mt-8">Нет товаров, соответствующих поиску.</p>
      )}
    </div>
  );
}
