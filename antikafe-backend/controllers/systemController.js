// controllers/systemController.js
const Role = require('../models/Role');

exports.getRoles = async (req, res) => {
  const { companyId } = req.query;
  const roles = await Role.find({ companyId });
  res.json(roles);
};

exports.createRole = async (req, res) => {
  const { name, permissions, companyId } = req.body;
  const role = new Role({ name, permissions, companyId });
  await role.save();
  res.status(201).json(role);
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const role = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });
  res.json(role);
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  await Role.findByIdAndDelete(id);
  res.status(204).end();
};
