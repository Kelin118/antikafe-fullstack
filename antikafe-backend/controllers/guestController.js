const Guest = require('../models/Guest');
const { v4: uuidv4 } = require('uuid'); // вверху файла

// GET /guests
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ companyId: req.user.companyId }); // 👈
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении гостей', error });
  }
};

// POST /guests
exports.addGuest = async (req, res) => {
  try {
    const guest = new Guest({
      name: req.body.name,
      companyId: req.user.companyId // 👈
    });
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении гостя', error });
  }
};

// DELETE /guests/:id
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId // 👈 гарантирует, что удаляется только гость этой компании
    });

    if (!guest) {
      return res.status(404).json({ message: 'Гость не найден или доступ запрещён' });
    }

    res.json({ message: 'Гость удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении гостя', error });
  }
};

// POST /guests/group
exports.addGuestGroup = async (req, res) => {
  const { guests } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ error: 'Invalid guest list' });
  }

  const groupId = uuidv4(); // 👈 создаём уникальный идентификатор группы

  try {
    const createdGuests = await Promise.all(
      guests.map(name => {
        const guest = new Guest({ name, groupId });
        return guest.save();
      })
    );

    res.status(201).json({ message: 'Group added', guests: createdGuests });
  } catch (err) {
    console.error('Error saving group:', err);
    res.status(500).json({ error: 'Failed to save guest group' });
  }
};
