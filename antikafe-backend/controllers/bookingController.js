const Booking = require('../models/Booking');

// Получить все бронирования (опционально по дате)
exports.getBookings = async (req, res) => {
  const { date } = req.query;
  const filter = date
    ? {
        startTime: {
          $gte: new Date(`${date}T00:00:00Z`),
          $lte: new Date(`${date}T23:59:59Z`)
        }
      }
    : {};

  const bookings = await Booking.find(filter).sort('startTime');
  res.json(bookings);
};

// Создать новое бронирование
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Ошибка при создании брони' });
  }
};

// Обновить статус/данные брони
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Ошибка при обновлении брони' });
  }
};

// Удалить бронирование
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Бронь удалена' });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка при удалении брони' });
  }
};
