const Service=require('./serviceModel');
const ServiceAvailability=require('./serviceAvailabilty');
const Staff = require('./staffModel');
const StaffAvailability=require('./staffAvailability')
const Appointment=require('./appointmentModel');
Service.hasMany(ServiceAvailability);
ServiceAvailability.belongsTo(Service);

Staff.belongsToMany(Service, { through: 'StaffServices' });
Service.belongsToMany(Staff, { through: 'StaffServices' });

Staff.hasMany(StaffAvailability, {
  foreignKey: {
    name: 'staffId', 
    allowNull: false
  },
  as: 'availability'
});

StaffAvailability.belongsTo(Staff, {
  foreignKey: {
    name: 'staffId',
    allowNull: false
  }
});

  Appointment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Appointment, { foreignKey: 'userId' });

Appointment.belongsTo(Staff, { foreignKey: 'staffId' });
Staff.hasMany(Appointment, { foreignKey: 'staffId' });

Appointment.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasMany(Appointment, { foreignKey: 'serviceId' });


module.exports={
    Service,ServiceAvailability,Staff,StaffAvailability,Appointment
}