import React from 'react';
import AddGuestForm from '../../components/AddGuestForm';
import GuestList from '../../components/GuestList';

const GuestsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Гости антикафе</h1>
      
      <div className="bg-white shadow rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">Добавить гостя</h2>
        <AddGuestForm />
      </div>

      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-secondary mb-4">Список гостей</h2>
        <GuestList />
      </div>
    </div>
  );
};

export default GuestsPage;
