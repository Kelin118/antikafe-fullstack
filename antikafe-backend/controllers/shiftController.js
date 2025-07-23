const Shift = require('../models/Shift');
const Company = require('../models/Company'); // не забудь импортировать

exports.openShift = async (req, res) => {
  try {
    const { openingAmount, openingDenominations } = req.body;
    const { userId, companyId } = req.user;

    // Проверка: смена уже открыта?
    const existingOpenShift = await Shift.findOne({ companyId, isOpen: true });
    if (existingOpenShift) {
      return res.status(400).json({ message: 'Смена уже открыта' });
    }

    // Создание новой смены
    const shift = new Shift({
      companyId,
      cashierId: userId,
      openingAmount,
      openingDenominations,
    });

    await shift.save();

    // Сохраняем номиналы в компанию
    await Company.findByIdAndUpdate(companyId, {
      lastDenominations: openingDenominations,
    });

    res.status(201).json({ message: 'Смена успешно открыта', shift });
  } catch (err) {
    console.error('Ошибка при открытии смены:', err);
    res.status(500).json({ message: 'Ошибка открытия смены', error: err.message });
  }
};

exports.closeShift = async (req, res) => {
  try {
    const {
      closingAmount,
      closingDenominations,
      cashWithdrawal = 0,
      cardAmountCalculated = 0,
      cardAmountEntered = 0
    } = req.body;

    const { userId, companyId } = req.user;

    const openShift = await Shift.findOne({ companyId, isOpen: true });
    if (!openShift) {
      return res.status(404).json({ message: 'Нет открытой смены для закрытия' });
    }

    // 📉 Вычисляем расхождение по карте
    const cardMismatch = cardAmountEntered - cardAmountCalculated;

    openShift.closingAmount = closingAmount;
    openShift.closingDenominations = closingDenominations;
    openShift.cashWithdrawal = cashWithdrawal;
    openShift.cardAmountCalculated = cardAmountCalculated;
    openShift.cardAmountEntered = cardAmountEntered;
    openShift.cardMismatch = cardMismatch;

    openShift.closedAt = new Date();
    openShift.isOpen = false;

    await openShift.save();

    // 💾 Обновим компанию: запоминаем последние номиналы
    await Company.findByIdAndUpdate(companyId, {
      lastDenominations: closingDenominations,
    });

    res.status(200).json({
      message: 'Смена успешно закрыта',
      shift: openShift
    });
  } catch (err) {
    console.error('Ошибка при закрытии смены:', err);
    res.status(500).json({ message: 'Ошибка закрытия смены', error: err.message });
  }
};
