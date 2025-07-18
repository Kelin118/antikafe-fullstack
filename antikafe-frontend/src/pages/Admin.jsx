// src/pages/Admin.jsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  const cards = [
    { title: 'Гости', path: '/admin/guests', icon: '🧑‍🤝‍🧑' },
    { title: 'Бронирования', path: '/admin/bookings', icon: '📅' },
    { title: 'Сотрудники', path: '/admin/employees', icon: '👨‍💼' },
    { title: 'Товары', path: '/admin/products', icon: '🛍️' },
    { title: 'Система', path: '/admin/system', icon: '⚙️' },
  ];

  const isDashboard = location.pathname === '/admin';

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {isDashboard ? (
        <>
          <h1 className="text-3xl font-bold text-primary mb-10 text-center">Панель администратора</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cards.map(({ title, path, icon }) => (
              <Card
                key={path}
                onClick={() => navigate(path)}
                className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4">{icon}</div>
                  <h2 className="text-xl font-semibold text-secondary dark:text-white">{title}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
