const Service=require('./serviceModel');
const ServiceAvailability=require('./serviceAvailabilty');



Service.hasMany(ServiceAvailability);
ServiceAvailability.belongsTo(Service);



module.exports={
    Service,ServiceAvailability
}