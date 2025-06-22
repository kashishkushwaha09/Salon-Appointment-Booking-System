const Staff = require('../models/staffModel');
const StaffAvailability = require('../models/staffAvailability');
const { AppError } = require('../utils/appError');

const setAvailabilityForStaff = async (staffId, availability) => {
    try {

        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            throw new AppError('Staff not found', 404);
        }
        const data = availability.map(slot => ({
            ...slot,
            staffId
        }));
         await StaffAvailability.destroy({ where: { staffId } });
        const newAvailabilty = await StaffAvailability.bulkCreate(data);
        return newAvailabilty;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
};
const getAvailabilityForStaff = async (staffId) => {
  try {

    const staff = await Staff.findByPk(staffId, {
      include: [{
        model: StaffAvailability,
        as: 'availability'
      }]
    });

    if (!staff) {
   throw new AppError('Staff not found', 404);
    }

    return staff;
  } catch (error) {
     if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
  }
};
const updateAvailabilitySlot = async (availabilityId,dayOfWeek,startTime,endTime) => {
  try {   
 const slot = await StaffAvailability.findByPk(availabilityId);
    if (!slot) {
     throw new AppError('Availability slot not found', 404);
    }
    await slot.update({
      dayOfWeek: dayOfWeek ?? slot.dayOfWeek,
      startTime: startTime ?? slot.startTime,
      endTime: endTime ?? slot.endTime
    });
   return slot;
  } catch (error) {
     if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
  }
};
const deleteAvailabilitySlot = async (availabilityId) => {
  try {
    const slot = await StaffAvailability.findByPk(availabilityId);
    if (!slot) {
    throw new AppError('Availability slot not found', 404);
    }
    await slot.destroy();

  } catch (error) {
    if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
  }
};
module.exports = {
    setAvailabilityForStaff,getAvailabilityForStaff,updateAvailabilitySlot,deleteAvailabilitySlot
}