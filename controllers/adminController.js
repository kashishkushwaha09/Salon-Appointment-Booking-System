const User=require('../models/userModel');
const Staff = require('../models/staffModel');
const Service = require('../models/serviceModel');
const Appointment = require('../models/appointmentModel');

const { AppError } = require('../utils/appError');
const { Op } = require('sequelize');
const getAllUsers = async (req, res) => {
  const users = await User.findAll({ where: { role: 'customer' } });
  res.status(200).json({ users });
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
  const { name, email, phone, gender, avatarUrl } = req.body;

  const user = await User.findOne({ where: { id, role: 'customer' } });
  if (!user) throw new AppError('Customer not found', 404);

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.phone = phone ?? user.phone;
  user.gender = gender ?? user.gender;
  user.avatarUrl = avatarUrl ?? user.avatarUrl;

  await user.save();
  res.status(200).json({ message: 'Customer updated successfully', user });
    } catch (error) {
        console.log("Error in updating customer ",error);
        throw new AppError("Failed updating customer profile ",500);
    }
  
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

  const user = await User.findOne({ where: { id, role: 'customer' } });
  if (!user) throw new AppError('Customer not found', 404);

  await user.destroy();
  res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
         console.log("Error in deleting customer ",error);
        throw new AppError("Failed deleting customer profile ",500);
    }
  
};

module.exports={
    getAllUsers,updateUser,deleteUser
}