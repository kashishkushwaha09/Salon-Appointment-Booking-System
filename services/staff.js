const { AppError } = require("../utils/appError");
const Staff = require('../models/staffModel');
const Service = require('../models/serviceModel');
const StaffAvailability = require('../models/staffAvailability');
const ServiceAvailability=require('../models/serviceAvailabilty');
const addStaff = async (name, bio, specializations) => {
    try {
        const newStaff = await Staff.create({
            name,
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
                { model: Service },
                { model: StaffAvailability, as: 'availability' }
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
        await staff.update({
            name: name ?? staff.name,
            bio: bio ?? staff.bio,
            specializations: specializations ?? staff.specializations
        });

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