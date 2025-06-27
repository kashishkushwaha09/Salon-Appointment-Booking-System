const { AppError } = require("../utils/appError");
const Staff = require('../models/staffModel');
const Service = require('../models/serviceModel');
const Appointment = require('../models/appointmentModel');
const StaffAvailability = require('../models/staffAvailability');
const ServiceAvailability = require('../models/serviceAvailabilty');
const User=require('../models/userModel');

const { Op } = require("sequelize");
const sendAppointmentEmail=require("../utils/sendEmail");

const getAvailableSlots = async (req, res) => {
    try {
        const { serviceId, date } = req.query;
        console.log(req.query);
        if (!serviceId || !date)
            throw new AppError('serviceId and date are required', 400);
       const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }); 
        const service = await Service.findByPk(serviceId, {
      include: {
        model: ServiceAvailability,
        where: { dayOfWeek },
      }
    });
      if (!service || service.ServiceAvailabilities.length === 0) {
        throw new AppError('No service availability on this day', 404);
      }
      const duration = service.duration; // in minutes
       const assignedStaff = await Staff.findAll({
      include: [
        {
          model: Service,
          where: { id: serviceId },
        },
        {
          model: StaffAvailability,
          as: 'availability',
          where: { dayOfWeek }
        },
          {
      model: User,
      attributes: ['name']
    }
      ]
    });
    const results = [];

    for (const staff of assignedStaff) {
      const staffAvail = staff.availability.find(a => a.dayOfWeek === dayOfWeek);
      const serviceAvail = service.ServiceAvailabilities.find(a => a.dayOfWeek === dayOfWeek);

      const startTime = staffAvail.startTime > serviceAvail.startTime ? staffAvail.startTime : serviceAvail.startTime;
      const endTime = staffAvail.endTime < serviceAvail.endTime ? staffAvail.endTime : serviceAvail.endTime;

      const slots = [];
      let current = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);
      
      while (current.getTime() + duration * 60000 <= end.getTime()) {
        const formatted = current.toTimeString().substring(0, 5);

        const conflict = await Appointment.findOne({
          where: {
            staffId: staff.id,
            date,
            startTime: formatted
          }
        });

        if (!conflict) {
          slots.push(formatted);
        }

        current = new Date(current.getTime() + duration * 60000);
      }

      results.push({
        staffId: staff.id,
        staffName:staff.User?.name || 'Unknown',
        availableSlots: slots
      });
    }
     res.status(200).json(results);
    } catch (error) {
     console.error(error);
     throw new AppError('Server error while fetching slots',500);
    }

}
const validateBeforePayment = async (req, res) => {
  try {
    const { serviceId, staffId, date, startTime } = req.body;

    const service = await Service.findByPk(serviceId);
    if (!service) throw new AppError("Service not found", 404);

    const existing = await Appointment.findOne({ where: { staffId, date, startTime } });
    if (existing) throw new AppError("Slot already booked", 400);

    res.status(200).json({ valid: true });
  } catch (error) {
     console.error(error);
  throw new AppError(error.message, 500);
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, date, startTime } = req.body;
    const userId = req.user.id;

    if (!serviceId || !staffId || !date || !startTime) {
      throw new AppError('All fields are required',400);
    }

    const service = await Service.findByPk(serviceId);
    if (!service)
       throw new AppError('Service not found',404); 
    
    const existing = await Appointment.findOne({
      where: { staffId, date, startTime }
    });
    if (existing) 
      throw new AppError('This slot is already booked',400);
    
    
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
    const endTime = endDateTime.toTimeString().substring(0, 5);

    const appointment = await Appointment.create({
      userId,
      staffId,
      serviceId,
      date,
      startTime,
      endTime,
      status: 'confirmed'
    });
    const user=req.user;
    const subject='Appointment Confirmed!';
    const htmlContent=`
        <h2>Hey ${user.name},</h2>
        <p>Your appointment for <strong>${service.name}</strong> has been confirmed!</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p>Thank you for choosing our salon</p>
      `;
  await sendAppointmentEmail(user.email,subject,htmlContent);
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error(error);
  throw new AppError('Error booking appointment', 500);
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [Service,
        {
      model: Staff,
      include: { model: User, attributes: ['name'] }
    }
      ]
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
  throw new AppError('Error fetching your appointments', 500);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
  include: [
    { model: User, attributes: ['name', 'email'] },
    { model: Service },
     {
      model: Staff,
      include: { model: User, attributes: ['name'] } 
    }
  ],
  order: [['date', 'DESC']]
});

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
   throw new AppError('Error fetching all appointments', 500);
  }
};
const rescheduleAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { date, startTime } = req.body;
  
    const appointment = await Appointment.findByPk(appointmentId,{
      include:[User,Service]
    });
    if (!appointment) 
      throw new AppError('Appointment not found',404);

       const isAdmin = req.user.role === 'admin';
const isOwner = req.user.id === appointment.userId;
    if (!isAdmin && !isOwner) {
  throw new AppError('You are not authorized to modify this appointment', 403);
}
    if (appointment.status !== 'confirmed') {
      throw new AppError('Only confirmed appointments can be rescheduled',400);

    }
 
      const service = appointment.Service;
    const user = appointment.User;
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
    const endTime = endDateTime.toTimeString().substring(0, 5);

    const conflict = await Appointment.findOne({
      where: {
        staffId: appointment.staffId,
        date,
        startTime,
        id: { [Op.ne]: appointmentId } // skip current appointment
      }
    });
    if (conflict)
      throw new AppError('This time slot is already booked',400);

    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = 'rescheduled';
    await appointment.save();

     const subject = 'Appointment Rescheduled';
    const htmlContent = `
      <h2>Hi ${user.name},</h2>
      <p>Your appointment for <strong>${service.name}</strong> has been <span style="color:orange;"><strong>rescheduled</strong></span>.</p>
      <p><strong>New Date:</strong> ${date}</p>
      <p><strong>New Time:</strong> ${startTime} - ${endTime}</p>
    `;

    await sendAppointmentEmail(user.email, subject, htmlContent);
    res.status(200).json({ message: 'Appointment rescheduled', appointment });
  } catch (err) {
    console.error(err);
    throw new AppError('Error rescheduling appointment', 500);
  }
};
const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByPk(appointmentId,{
      include:[User,Service]
    });

    if (!appointment) 
      throw new AppError('Appointment not found',404);

         const isAdmin = req.user.role === 'admin';
const isOwner = req.user.id === appointment.userId;
    if (!isAdmin && !isOwner) {
  throw new AppError('You are not authorized to modify this appointment', 403);
}
    await appointment.destroy();
       const service = appointment.Service;
    const user = appointment.User;

     const subject = 'Appointment cancelled';
   const htmlContent = `
  <h2>Hi ${user.name},</h2>
  <p>Your appointment for <strong>${service.name}</strong> has been <span style="color:red;"><strong>cancelled</strong></span>.</p>
  <p><strong>Original Date:</strong> ${appointment.date}</p>
  <p><strong>Original Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
  <p>If this was a mistake or you need to rebook, please visit our booking page.</p>
  <p>We hope to serve you soon!</p>
`;
    await sendAppointmentEmail(user.email, subject, htmlContent);
    res.status(200).json({ message: 'Appointment cancelled (deleted) successfully' });
  
  } catch (err) {
    console.error(err);
   throw new AppError('Error cancelling appointment', 500);
  }
};

module.exports={
    validateBeforePayment,getAvailableSlots,bookAppointment,getMyAppointments,getAllAppointments,rescheduleAppointment,cancelAppointment
}