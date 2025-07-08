const Product = require('../models/Product');
const ProductGroup = require('../models/ProductGroup');

// Группы
exports.getGroups = async (req, res) => {
  const groups = await ProductGroup.find();
  res.json(groups);
};

exports.createGroup = async (req, res) => {
  const group = new ProductGroup(req.body);
  await group.save();
  res.status(201).json(group);
};

exports.deleteGroup = async (req, res) => {
  await ProductGroup.findByIdAndDelete(req.params.id);
  res.json({ message: 'Группа удалена' });
};

// Товары
exports.getProducts = async (req, res) => {
  const products = await Product.find().populate('group');
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Товар удалён' });
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};
