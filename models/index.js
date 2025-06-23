const Service=require('./serviceModel');
const ServiceAvailability=require('./serviceAvailabilty');
const Staff = require('./staffModel');
const StaffAvailability=require('./staffAvailability')
const Appointment=require('./appointmentModel');
const User=require('./userModel');
const Review=require('./reviewModel');
Service.hasMany(ServiceAvailability);
ServiceAvailability.belongsTo(Service);

User.hasOne(Staff, { foreignKey: 'userId' });
Staff.belongsTo(User, { foreignKey: 'userId' });

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

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Service, { foreignKey: 'serviceId' });
Review.belongsTo(Staff, { foreignKey: 'staffId' });

User.hasMany(Review);
Service.hasMany(Review);
Staff.hasMany(Review);

module.exports={
    Service,ServiceAvailability,Staff,StaffAvailability,Appointment
}