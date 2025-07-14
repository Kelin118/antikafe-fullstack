// SettingsTab.jsx с тёмной темой, вкладками и секциями
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    companyName: '',
    workingHours: '',
    language: 'ru',
    autoSave: false,
    notifications: true,
  });
  const [activeTab, setActiveTab] = useState('general');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    if (companyId) fetchSettings();
  }, [companyId]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`/settings?companyId=${companyId}`);
      setSettings(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке настроек:', err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put('/settings', { ...settings, companyId });
      alert('✅ Настройки сохранены');
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      alert('❌ Не удалось сохранить');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('companyId', companyId);

    try {
      setLoading(true);
      await axios.post('/settings/logo', formData);
      alert('✅ Логотип обновлён');
    } catch (err) {
      console.error('Ошибка загрузки логотипа:', err);
      alert('❌ Не удалось загрузить логотип');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-primary mb-4">Настройки компании</h1>

      {/* Вкладки */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
        <button onClick={() => setActiveTab('general')} className={`pb-1 border-b-2 ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Общие</button>
        <button onClick={() => setActiveTab('logo')} className={`pb-1 border-b-2 ${activeTab === 'logo' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Логотип</button>
        <button onClick={() => setActiveTab('system')} className={`pb-1 border-b-2 ${activeTab === 'system' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Система</button>
      </div>

      {/* Вкладка Общие */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название компании</label>
            <input
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
              placeholder="Например: MyAntikafe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Время работы</label>
            <input
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
              placeholder="Например: 10:00 - 22:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Язык</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
            >
              <option value="ru">Русский</option>
              <option value="kz">Казахский</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
            />
            <span>Автосохранение</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
            <span>Уведомления</span>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
          >
            {loading ? 'Сохраняю...' : 'Сохранить'}
          </button>
        </div>
      )}

      {/* Вкладка логотипа */}
      {activeTab === 'logo' && (
        <div>
          <label className="block mb-2">Загрузить логотип компании</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-600"
          />
        </div>
      )}

      {/* Вкладка система */}
      {activeTab === 'system' && (
        <div className="text-sm text-gray-400">
          Здесь будут будущие параметры безопасности, API ключи и резервное копирование...
        </div>
      )}
    </div>
  );
}
