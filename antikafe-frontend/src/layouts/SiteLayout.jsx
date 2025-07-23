import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function SiteLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      {/* 🔝 Верхняя панель */}
      <header className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-primary dark:text-white">📋 Панель антикафе</h1>

        {/* 🔘 Бургер-меню (мобилки) */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        {/* 📱 Мобильное меню */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 flex flex-col gap-2 p-4 sm:hidden">
            <Link to="/site/home" onClick={() => setMobileMenuOpen(false)}>Главная</Link>
            <Link to="/site/bookings" onClick={() => setMobileMenuOpen(false)}>Бронирования</Link>
            <Link to="/site/products" onClick={() => setMobileMenuOpen(false)}>Продукты</Link>
            <Link to="/site/system" onClick={() => setMobileMenuOpen(false)}>Система</Link>
            <Link to="/site/shifts" onClick={() => setMobileMenuOpen(false)}>История смен</Link>
            <Link to="/site/finance" onClick={() => setMobileMenuOpen(false)}>Финансы</Link>
            <button onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/admin');
              }}
              className="bg-accent px-3 py-1 rounded text-white"
            >
              Веб-приложение
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Выйти
            </button>
          </div>
        )}

        {/* 💻 Десктоп-меню */}
        <nav className="hidden sm:flex gap-3 items-center">
          <Link to="/site/home" className="hover:text-primary dark:hover:text-yellow-400">Главная</Link>
          <Link to="/site/bookings" className="hover:text-primary dark:hover:text-yellow-400">Бронирования</Link>
          <Link to="/site/products" className="hover:text-primary dark:hover:text-yellow-400">Продукты</Link>
          <Link to="/site/system" className="hover:text-primary dark:hover:text-yellow-400">Система</Link>
          <Link to="/site/shifts" className="hover:text-primary dark:hover:text-yellow-400">История смен</Link>
          <Link to="/site/finance" className="hover:text-primary dark:hover:text-yellow-400">Финансы</Link>
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
            Веб-приложение
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
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
