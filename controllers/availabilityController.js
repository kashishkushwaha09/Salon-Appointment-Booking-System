
const availabilityService = require('../services/availabilityService');
const { AppError } = require('../utils/appError');

const setAvailability = async (req, res) => {
    try {
        const ServiceId = req.params.id;
        const availability = req.body; // array of {dayOfWeek, startTime, endTime}
        const newData = availability.map(a => ({ ...a, ServiceId }));
        const newAvailability = await availabilityService.setAvailability(newData);
        res.status(201).json({ message: 'Availability set successfully', data: newAvailability, success: true });
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
};
const getAvailability = async (req, res) => {
  try {
    const ServiceId = req.params.id;
    const availability = await availabilityService.getAll(ServiceId);
    res.status(200).json({ availability,success:true });
  } catch (error) {
    if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
  }
};
const updateAvailability=async(req, res) => {
    try {
         const slotId = req.params.id;
    const { dayOfWeek, startTime, endTime } = req.body;
    const slot=await availabilityService.updateAvailability(slotId,dayOfWeek,startTime,endTime);
    res.status(200).json({ message: 'Availability updated', slot });
    } catch (error) {
         if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const deleteAvailability=async(req, res) => {
      try {
        const slotId = req.params.id;
       await availabilityService.deleteAvailability(slotId);
       res.status(200).json({ message: 'Availability slot deleted' });
    } catch (error) {
         if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}

module.exports = { setAvailability,getAvailability,updateAvailability,deleteAvailability}