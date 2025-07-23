const Shift = require('../models/Shift');
const Company = require('../models/Company'); // не забудь импортировать

exports.openShift = async (req, res) => {
  try {
    const { openingAmount, openingDenominations } = req.body;
    const { userId, companyId } = req.user;

    console.log('[ОТКРЫТИЕ СМЕНЫ]', { companyId, openingAmount }); // ← лог

    const existingOpenShift = await Shift.findOne({ companyId, isOpen: true });
    if (existingOpenShift) {
      return res.status(400).json({ message: 'Смена уже открыта' });
    }

    const shift = new Shift({
      companyId,
      cashierId: userId,
      openingAmount,
      openingDenominations
    });

    await shift.save();

    console.log('[СМЕНА СОХРАНЕНА]', shift); // ← лог

    res.status(201).json({ message: 'Смена открыта', shift });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка открытия смены', error: err.message });
  }
};



exports.closeShift = async (req, res) => {
  try {
    const { closingAmount, closingDenominations } = req.body;
    const { userId, companyId } = req.user;

    const openShift = await Shift.findOne({ companyId, isOpen: true });
    if (!openShift) {
      return res.status(404).json({ message: 'Нет открытой смены для закрытия' });
    }

    openShift.closingAmount = closingAmount;
    openShift.closingDenominations = closingDenominations;
    openShift.closedAt = new Date();
    openShift.isOpen = false;

    await openShift.save();

    // 💾 Обновим компанию
    await Company.findByIdAndUpdate(companyId, {
      lastDenominations: closingDenominations,
    });

    res.status(200).json({ message: 'Смена успешно закрыта', shift: openShift });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка закрытия смены', error: err.message });
  }
};
