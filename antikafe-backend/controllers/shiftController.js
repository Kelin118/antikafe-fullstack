const Shift = require('../models/Shift');

exports.openShift = async (req, res) => {
  try {
    const { openingAmount } = req.body;
    const { userId, companyId } = req.user;

    if (!openingAmount) return res.status(400).json({ message: 'Введите сумму кассы' });

    const existingOpenShift = await Shift.findOne({ companyId, isOpen: true });
    if (existingOpenShift) {
      return res.status(400).json({ message: 'Смена уже открыта' });
    }

    const shift = new Shift({ companyId, cashierId: userId, openingAmount });
    await shift.save();

    res.status(201).json({ message: 'Смена открыта', shift });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка открытия смены', error: err.message });
  }
};

exports.closeShift = async (req, res) => {
  try {
    const { closingAmount } = req.body;
    const { userId, companyId } = req.user;

    const openShift = await Shift.findOne({ companyId, isOpen: true });

    if (!openShift) {
      return res.status(404).json({ message: 'Нет открытой смены для закрытия' });
    }

    openShift.closingAmount = closingAmount;
    openShift.closedAt = new Date();
    openShift.isOpen = false;

    await openShift.save();

    res.status(200).json({ message: 'Смена успешно закрыта', shift: openShift });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка закрытия смены', error: err.message });
  }
};
