const Guest = require('../models/Guest');
const { v4: uuidv4 } = require('uuid'); // вверху файла
const GuestGroup = require('../models/GuestGroup');

// GET /guests
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });

    const guestsWithProducts = await Promise.all(
      guests.map(async (guest) => {
        const populatedProducts = await Product.find({ _id: { $in: guest.products } });
        return {
          ...guest.toObject(),
          products: populatedProducts,
        };
      })
    );

    res.json(guestsWithProducts);
  } catch (err) {
    console.error('❌ Ошибка при получении гостей:', err);
    res.status(500).json({ error: 'Ошибка при получении гостей' });
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

/// POST /guests/group
exports.addGuestGroup = async (req, res) => {
  const { guests } = req.body;

  if (!Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ error: 'Invalid guest list' });
  }

  const groupId = uuidv4();

  try {
    const createdGuests = await Promise.all(
      guests.map(({ name, products }) => {
        const guest = new Guest({
          name,
          groupId,
          products,
          companyId: req.user.companyId
        });
        return guest.save();
      })
    );

    res.status(201).json({ message: 'Group added', guests: createdGuests });
  } catch (err) {
    console.error('Error saving group:', err);
    res.status(500).json({ error: 'Failed to save guest group' });
  }
};

// Сохранить группу гостей
exports.saveGuestGroup = async (req, res) => {
  try {
    const { guests, paymentType, cashAmount = 0, cardAmount = 0 } = req.body;

    const totalSum = guests.reduce(
      (sum, g) => sum + g.products.reduce((s, p) => s + p.price, 0),
      0
    );

    const group = await GuestGroup.create({
      guests,
      paymentType,
      cashAmount,
      cardAmount,
      totalSum
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('❌ Ошибка при сохранении группы гостей:', error);
    res.status(500).json({ error: 'Ошибка при сохранении группы гостей' });
  }
};
exports.getGuestGroups = async (req, res) => {
  try {
    const groups = await GuestGroup.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    console.error('❌ Ошибка при получении групп гостей:', error);
    res.status(500).json({ error: 'Ошибка при загрузке групп' });
  }
};
