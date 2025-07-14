import { useState } from 'react';
import UsersTab from './system/UsersTab';
import SettingsTab from './system/SettingsTab';
import SecurityTab from './system/SecurityTab';

export default function SiteSystemPage() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { key: 'users', label: 'Пользователи' },
    { key: 'settings', label: 'Настройки' },
    { key: 'security', label: 'Безопасность' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">⚙️ Системные настройки</h1>

      {/* Табы */}
      <div className="flex gap-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div className="bg-white shadow rounded-lg p-4">
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
