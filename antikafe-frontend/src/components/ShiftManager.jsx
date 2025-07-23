import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import ShiftModal from './ShiftModal';

export default function ShiftManager() {
  const [isOpen, setIsOpen] = useState(false); // смена открыта?
  const [modalType, setModalType] = useState(null); // 'open' | 'close'

  const checkShiftStatus = async () => {
    try {
      const res = await axios.get('/shift/status');
      setIsOpen(res.data.isOpen);
    } catch (err) {
      console.error('Ошибка при проверке смены');
    }
  };

  useEffect(() => {
    checkShiftStatus();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Смена</h1>
      <button
        className={`px-6 py-2 rounded text-white ${isOpen ? 'bg-red-600' : 'bg-green-600'}`}
        onClick={() => setModalType(isOpen ? 'close' : 'open')}
      >
        {isOpen ? 'Закрыть смену' : 'Открыть смену'}
      </button>

      {modalType && (
        <ShiftModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            checkShiftStatus();
          }}
        />
      )}
    </div>
  );
}
