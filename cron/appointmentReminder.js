const cron = require('node-cron');
const Appointment=require('../models/appointmentModel');
const User=require('../models/userModel');
const Staff=require('../models/staffModel');
const Service=require('../models/serviceModel');
const sendReminderEmail = require('../utils/sendReminderEmail');

cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    const appointments = await Appointment.findAll({
      where: { date: formattedDate, status: 'confirmed' },
      include: [User, Staff, Service]
    });

    for (const appt of appointments) {
      await sendReminderEmail(appt.User.email, {
        name: appt.User.name,
        serviceName: appt.Service.name,
        staffName: appt.Staff.name,
        date: appt.date,
        time: `${appt.startTime} - ${appt.endTime}`
      });
    }

    console.log(`Reminders sent: ${appointments.length}`);
  } catch (err) {
    console.log('Cron job error:', err.message);
  }
});
