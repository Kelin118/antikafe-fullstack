const Guest = require('../models/Guest');
const { v4: uuidv4 } = require('uuid'); // вверху файла

// GET /guests
exports.getGuests = async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
};

// POST /guests
exports.addGuest = async (req, res) => {
  const { name } = req.body;
  const guest = new Guest({ name });
  await guest.save();
  res.status(201).json(guest);
};

// DELETE /guests/:id
exports.deleteGuest = async (req, res) => {
  const { id } = req.params;
  await Guest.findByIdAndDelete(id);
  res.json({ message: 'Guest removed' });
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
