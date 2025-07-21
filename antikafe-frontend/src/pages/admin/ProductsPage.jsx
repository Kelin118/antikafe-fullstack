import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, groupRes] = await Promise.all([
          axios.get('/products'),
          axios.get('/products/groups'),
        ]);
        setProducts(productRes.data);
        setGroups(groupRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-secondary">📦 Товары</h1>

      <input
        type="text"
        placeholder="🔍 Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded w-full md:w-1/2"
      />

      {groups.map((group) => {
        const groupProducts = filteredProducts.filter(
          p => p.groupId?._id === group._id
        );
        if (groupProducts.length === 0) return null;

        return (
          <div key={group._id} className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{group.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <p>💰 Цена: <strong>{product.price}₸</strong></p>
                    <p>📦 Остаток: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 mt-8 text-center">Нет товаров, соответствующих поиску.</p>
      )}
    </div>
  );
}
