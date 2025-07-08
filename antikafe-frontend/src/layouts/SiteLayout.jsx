import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SiteLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔝 Верхняя панель */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">📋 Панель антикафе</h1>
        <nav className="flex gap-4">
          <Link to="/site/home" className="hover:text-primary">Главная</Link>
          <Link to="/site/bookings" className="hover:text-primary">Бронирования</Link>
          <Link to="/site/guests" className="hover:text-primary">Гости</Link>
          <Link to="/site/products" className="hover:text-primary">Продукты</Link>
          <Link to="/site/system" className="hover:text-primary">Система</Link>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm bg-accent px-3 py-1 rounded hover:bg-yellow-400"
          >
            Перейти в веб-приложение
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Выйти
          </button>
        </nav>
      </header>

      {/* 🧩 Контент */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
