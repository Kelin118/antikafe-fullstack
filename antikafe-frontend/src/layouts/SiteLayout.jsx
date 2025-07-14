import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SiteLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      {/* 🔝 Верхняя панель */}
      <header className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary dark:text-white">📋 Панель антикафе</h1>

        <nav className="flex gap-3 items-center">
          <Link to="/site/home" className="hover:text-primary dark:hover:text-yellow-400">Главная</Link>
          <Link to="/site/bookings" className="hover:text-primary dark:hover:text-yellow-400">Бронирования</Link>
          <Link to="/site/products" className="hover:text-primary dark:hover:text-yellow-400">Продукты</Link>
          <Link to="/site/system" className="hover:text-primary dark:hover:text-yellow-400">Система</Link>

          {/* Переключатель темы */}
          <button
            onClick={toggleTheme}
            className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Переключить тему"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

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
