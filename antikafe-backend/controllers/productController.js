
const Product = require('../models/Product');
const ProductGroup = require('../models/ProductGroup');
const mongoose = require('mongoose');

// Получить все товары текущей компании
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ companyId: req.user.companyId }).populate('groupId');
    res.json(products);
  } catch (err) {
    console.error('Ошибка получения товаров:', err);
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
};

// Создать товар
exports.createProduct = async (req, res) => {
  const { name, price, stock, description, groupId } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Имя товара обязательно' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Цена должна быть положительным числом' });
  }
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Неверный ID группы' });
  }

  const group = await ProductGroup.findOne({ _id: groupId, companyId: req.user.companyId });
  if (!group) {
    return res.status(400).json({ error: 'Группа не найдена или не принадлежит компании' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      stock,
      description,
      groupId,
      companyId: req.user.companyId
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Ошибка создания товара:', err);
    res.status(500).json({ error: 'Ошибка создания товара' });
  }
};

// Обновить товар
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description, groupId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Неверный ID товара' });
  }

  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      { name, price, stock, description, groupId },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Товар не найден' });

    res.json(product);
  } catch (err) {
    console.error('Ошибка обновления товара:', err);
    res.status(500).json({ error: 'Ошибка обновления товара' });
  }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Неверный ID товара' });
  }

  try {
    const deleted = await Product.findOneAndDelete({ _id: id, companyId: req.user.companyId });
    if (!deleted) return res.status(404).json({ error: 'Товар не найден' });

    res.json({ message: 'Товар удалён' });
  } catch (err) {
    console.error('Ошибка удаления товара:', err);
    res.status(500).json({ error: 'Ошибка удаления товара' });
  }
};

// Получить группы товаров текущей компании
exports.getGroups = async (req, res) => {
  try {
    const groups = await ProductGroup.find({ companyId: req.user.companyId });
    res.json(groups);
  } catch (err) {
    console.error('Ошибка получения групп:', err);
    res.status(500).json({ error: 'Ошибка получения групп' });
  }
};

// Создать группу товаров
exports.createGroup = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Название группы обязательно' });
  }

  try {
    const newGroup = new ProductGroup({ name, companyId: req.user.companyId });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error('Ошибка создания группы:', err);
    res.status(500).json({ error: 'Ошибка создания группы' });
  }
};

// Удалить группу
exports.deleteGroup = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Неверный ID группы' });
  }

  try {
    const deleted = await ProductGroup.findOneAndDelete({ _id: id, companyId: req.user.companyId });
    if (!deleted) return res.status(404).json({ error: 'Группа не найдена' });

    res.json({ message: 'Группа удалена' });
  } catch (err) {
    console.error('Ошибка удаления группы:', err);
    res.status(500).json({ error: 'Ошибка удаления группы' });
  }
};
