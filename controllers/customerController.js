const User=require('../models/userModel');
const { AppError } = require('../utils/appError');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name','phone','gender', 'email']
    });
    res.status(200).json(user);
  } catch (err) {
     console.log(err);
    throw new AppError('Error fetching profile', 500);
  }
};
const getAllUsers = async (req, res) => {
  const users = await User.findAll({ where: { role: 'customer' }, attributes: ['id', 'name','phone','gender', 'email'] });
  res.status(200).json({ users });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    const { name, phone,gender,email} = req.body;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.gender=gender || user.gender;
    user.email=email || user.email;

    await user.save();
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.log(err);
    throw new AppError('Error updating profile', 500);
  }
};
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    await user.destroy();
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    throw new AppError('Error deleting account', 500);
  }
};
module.exports={
    getProfile,getAllUsers,updateProfile,deleteProfile
}