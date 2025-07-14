// src/pages/site/SiteHome.jsx
import { Link } from 'react-router-dom';

export default function SiteHome() {
  return (
    <div className="max-w-5xl mx-auto text-center mt-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
        Добро пожаловать в систему учёта антикафе
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Управляйте гостями, бронированиями и товарами — просто и удобно.  
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        <Link to="/site/bookings" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
          Перейти к бронированиям
        </Link>
        <Link to="/site/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg">
          Управление товарами
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard title="📋 Гости" description="Учитывайте гостей и групповые посещения." />
        <FeatureCard title="🛍️ Товары" description="Добавляйте товары, управляйте остатками и ценами." />
        <FeatureCard title="👥 Сотрудники" description="Контролируйте доступ и роли сотрудников." />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 hover:shadow-xl transition">
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
