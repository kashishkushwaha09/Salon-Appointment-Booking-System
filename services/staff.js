const { AppError } = require("../utils/appError");
const Staff = require('../models/staffModel');
const Service = require('../models/serviceModel');
const User=require('../models/userModel');
const StaffAvailability = require('../models/staffAvailability');
const ServiceAvailability=require('../models/serviceAvailabilty');
const addStaff = async (name,email,password,bio,specializations) => {
    try {
         const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }
     const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'staff'
    });
      const newStaff = await Staff.create({
           userId: user.id, 
            bio,
            specializations
        });
        return newStaff;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const getAll = async () => {
    try {
          const staffList = await Staff.findAll({
      include: [
        {
          model: Service,
          through: { attributes: [] }
        },
        {
          model: StaffAvailability,
          as: 'availability'
        },
        {
          model: User,
          attributes: ['name', 'email']
        }
      ]
    });
        return staffList;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const updateStaff = async (staffId, name, bio, specializations) => {
    try {
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            throw new AppError('Staff not found', 404);
        }
         if (name) {
    const user = await User.findByPk(staff.userId);
    if (user) {
      user.name = name;
      await user.save();
    }
  }
      staff.bio = bio ?? staff.bio;
  staff.specializations = specializations ?? staff.specializations;
  await staff.save();

        return staff;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
};
const assignServicesToStaff=async(staffId,serviceIds)=>{
try {
    const staff = await Staff.findByPk(staffId, {
      include: { model: StaffAvailability, as: 'availability' }
    });
    if (!staff) throw new AppError('Staff not found', 404);

    const services = await Service.findAll({
      where: { id: serviceIds },
      include: ServiceAvailability
    });
    const validServiceIds = [];

    for (const service of services) {
      const isSkillMatch = staff.specializations.includes(service.name);

      const serviceDays = service.ServiceAvailabilities?.map(sa => sa.dayOfWeek) || [];
      const staffDays = staff.availability.map(avail => avail.dayOfWeek);

      const commonDays = staffDays.filter(day => serviceDays.includes(day));

      if (isSkillMatch && commonDays.length > 0) {
        validServiceIds.push(service.id);
      }
    }
    if (validServiceIds.length === 0) {
      throw new AppError("No valid services match staff's skill and schedule.", 400);
    }

    await staff.setServices(validServiceIds);
    return validServiceIds;
} catch (error) {
    if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
}
}
module.exports = { addStaff, getAll, updateStaff,assignServicesToStaff};