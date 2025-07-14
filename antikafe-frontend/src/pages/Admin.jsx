import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin/guests', label: 'Гости' },
    { path: '/admin/products', label: 'Товары' },
    { path: '/admin/bookings', label: 'Бронирование' },
    { path: '/admin/add-group', label: 'Добавить группу' },
    { path: '/admin/system', label: 'Система / Пользователи' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Сайдбар */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">Админ-панель</h2>
          <nav className="space-y-3">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`block px-4 py-2 rounded-lg font-medium transition ${
                  location.pathname === path
                    ? 'bg-primary text-white'
                    : 'text-gray-800 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full text-center bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
