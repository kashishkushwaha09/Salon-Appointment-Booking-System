const staffAvailabilityService=require('../services/staffAvailabiltyService');

const setAvailabilityForStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const availability = req.body;  //array
     const data=await staffAvailabilityService.setAvailabilityForStaff(staffId,availability);
    res.status(201).json({
      message: 'Availability updated successfully',
      slots: data
    });
  } catch (err) {
    console.error(err);
    next(new AppError('Failed to set availability', 500));
  }
};
const getAvailabilityForStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
      const staff=await staffAvailabilityService.getAvailabilityForStaff(staffId);
    res.status(200).json({
      staffId: staff.id,
      name: staff.name,
      availability: staff.availability
    });
  } catch (err) {
    console.log('Get availability error:', err);
throw new AppError('Failed to fetch availability', 500);
  }
};
const updateAvailabilitySlot = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    const slot = await staffAvailabilityService.updateAvailabilitySlot(availabilityId,dayOfWeek, startTime, endTime);

    res.status(200).json({
      message: 'Availability slot updated successfully',
      slot
    });
  } catch (err) {
    console.error('Update availability error:', err);
    throw new AppError('Failed to update availability slot', 500);
  }
};
const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    await staffAvailabilityService.deleteAvailabilitySlot(availabilityId);
    res.status(200).json({
      message: 'Availability slot deleted successfully',
      slotId: availabilityId
    });
  } catch (err) {
    console.error('Delete availability error:', err);
  throw new AppError('Failed to delete availability slot', 500);
  }
};

module.exports={
    setAvailabilityForStaff,
    getAvailabilityForStaff,
    updateAvailabilitySlot,
    deleteAvailabilitySlot
};