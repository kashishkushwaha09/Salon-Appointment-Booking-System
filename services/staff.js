const { AppError } = require("../utils/appError");
const bcrypt=require('bcrypt');
const Staff = require('../models/staffModel');
const Service = require('../models/serviceModel');
const User=require('../models/userModel');
const StaffAvailability = require('../models/staffAvailability');
const ServiceAvailability=require('../models/serviceAvailabilty');
const addStaff = async (name,email,phone,gender,password,bio,specializations) => {
    try {
         const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }
     const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
      name,
      email,
      phone,
      gender,
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
const getById=async (id)=>{
  try {
          const staff = await Staff.findByPk(id,{
      include: [
        {
          model: Service,
           attributes: ['id', 'name', 'description', 'duration', 'price'],
          through: { attributes: [] }
        },
        {
          model: StaffAvailability,
          as: 'availability'
        },
        {
          model: User
        }
      ]
    });
        return staff;
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
           attributes: ['id', 'name', 'description', 'duration', 'price'],
          through: { attributes: [] }
        },
        {
          model: StaffAvailability,
          as: 'availability'
        },
        {
          model: User
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
const updateStaff = async (staffId, updates) => {
    try {
        const staff = await Staff.findByPk(staffId,{include:User});
        if (!staff) {
            throw new AppError('Staff not found', 404);
        }
         // Update related User
  await staff.User.update({
  name: updates.name?.trim().length>0 ? updates.name : staff.User.name,
  email: updates.email?.trim().length>0  ? updates.email : staff.User.email,
  phone: updates.phone?.trim().length>0  ? updates.phone : staff.User.phone,
  gender: updates.gender?.trim().length>0  ? updates.gender : staff.User.gender,
  ...(updates.password?.trim().length>0  && { password: updates.password })
});

      staff.bio = updates.bio.trim().length>0 ? updates.bio : staff.bio;
  staff.specializations = updates.specializations ?? staff.specializations;
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
const deleteStaff = async (id) => {
    try {
        const staff = await Staff.findByPk(id);
        if (!staff) {
            throw new AppError('Staff not found', 404);
        }
        await StaffAvailability.destroy({
            where: { staffId: id }
        });
        await User.destroy({
          where: {id:staff.userId}
        })
        await staff.destroy();
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }

}
module.exports = { addStaff, getById, getAll, updateStaff,assignServicesToStaff,deleteStaff};