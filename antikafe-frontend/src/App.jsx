import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Admin from './pages/Admin';
import GuestsPage from './pages/admin/GuestsPage';
import ProductsPage from './pages/admin/ProductsPage';
import SystemPage from './pages/admin/SystemPage';
import AddGuestGroup from './pages/admin/AddGuestGroup';
import BookingsPage from './pages/admin/BookingsPage';
import Employees from './pages/admin/Employees';

import SiteLayout from './layouts/SiteLayout';
import SiteHome from './pages/site/SiteHome';
import SiteProductsPage from './pages/site/SiteProductsPage';
import SiteBookingPage from './pages/site/SiteBookingPage';
import SiteSystemPage from './pages/site/SiteSystemPage';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* ✅ Оборачиваем для поддержки темы */}
        <Router>
          <div className="font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen transition-colors">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🔐 Сайт после входа (для всех ролей) */}
              <Route
                path="/site"
                element={
                  <ProtectedRoute>
                    <SiteLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="home" element={<SiteHome />} />
                <Route path="products" element={<SiteProductsPage />} />
                <Route path="bookings" element={<SiteBookingPage />} />
                <Route path="system" element={<SiteSystemPage />} />
              </Route>

              {/* 🔐 Админка (только для admin) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                }
              >
                <Route path="guests" element={<GuestsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="system" element={<SystemPage />} />
                <Route path="add-group" element={<AddGuestGroup />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="employees" element={<Employees />} />
              </Route>

              {/* 🚫 Доступ запрещён */}
              <Route
                path="/unauthorized"
                element={
                  <div className="p-8 text-center text-xl text-orange-500">
                    ⛔ У вас нет доступа к этой странице
                  </div>
                }
              />

              {/* ❌ Заглушка для всех несуществующих маршрутов */}
              <Route
                path="*"
                element={
                  <div className="p-8 text-center text-xl text-red-500">
                    404: Страница не найдена
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
