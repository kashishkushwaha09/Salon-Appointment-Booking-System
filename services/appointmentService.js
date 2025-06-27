
const Service = require('../models/serviceModel');
const Appointment = require('../models/appointmentModel');
const { AppError } = require("../utils/appError");
const sendAppointmentEmail = require("../utils/sendEmail");

exports.finalizeBooking = async ({ serviceId, staffId, date, startTime, user }) => {
    try {
          if (!serviceId || !staffId || !date || !startTime) {
          throw new AppError('All fields are required',400);
        }
    
  const service = await Service.findByPk(serviceId);
  if (!service) throw new AppError("Service not found", 404);

  const existing = await Appointment.findOne({ where: { staffId, date, startTime } });
  if (existing) throw new AppError("This slot is already booked", 400);

  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
  const endTime = endDateTime.toTimeString().substring(0, 5);

  const appointment = await Appointment.create({
    userId: user.id,
    staffId,
    serviceId,
    date,
    startTime,
    endTime,
    status: "confirmed"
  });

  const subject = "Appointment Confirmed!";
  const htmlContent = `
    <h2>Hey ${user.name},</h2>
    <p>Your appointment for <strong>${service.name}</strong> has been confirmed!</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
    <p>Thank you for choosing our salon.</p>
  `;

  await sendAppointmentEmail(user.email, subject, htmlContent);

  return appointment;
    } catch (error) {
       console.error(error);
       throw new AppError('Error booking appointment', 500); 
    }
  
};
