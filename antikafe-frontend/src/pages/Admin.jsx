import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Admin() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/guests', label: 'Гости' },
    { path: '/admin/products', label: 'Товары' },
    { path: '/admin/bookings', label: 'Бронирование' },
    { path: '/admin/add-group', label: 'Добавить группу' },
    { path: '/admin/system', label: 'Система / Пользователи' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Сайдбар */}
      <aside className="w-60 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-center text-primary">Админ-панель</h2>
        <nav className="space-y-2">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block px-4 py-2 rounded hover:bg-primary hover:text-white transition ${
                location.pathname === path ? 'bg-primary text-white' : 'text-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
