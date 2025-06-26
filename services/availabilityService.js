const { AppError } = require("../utils/appError");
const ServiceAvailability=require('../models/serviceAvailabilty');
const sequelize= require('../utils/db-connection');
const setAvailability=async(serviceId,newData)=>{
try {
    
    // await ServiceAvailability.destroy({ where: { serviceId } });
    const availability=await ServiceAvailability.bulkCreate(newData);
       return availability;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const getAll=async(ServiceId)=>{
    try {
    
    const availability= await ServiceAvailability.findAll({
         where: { ServiceId },
        order: [sequelize.literal(`FIELD(dayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`)]
         });
       return availability;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const updateAvailability=async(slotId,dayOfWeek,startTime,endTime)=>{
  try {
    const slot = await ServiceAvailability.findByPk(slotId);
    if (!slot) throw new AppError('Slot not found', 404);

    await slot.update({ dayOfWeek, startTime, endTime });
    return slot;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const deleteAvailability=async(slotId)=>{
 try {
    const slot = await ServiceAvailability.findByPk(slotId);
    if (!slot) return next(new AppError('Slot not found', 404));

    await slot.destroy();
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
module.exports={setAvailability,getAll,updateAvailability,deleteAvailability};