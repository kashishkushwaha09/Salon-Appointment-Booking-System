require('dotenv').config();
const fs=require('fs');
const path=require('path');
const express=require('express');
const app=express();
const db=require('./utils/db-connection');
const errorMiddleware=require('./middlewares/errorHandler');
const authenticateUser=require('./middlewares/authenticateUser');
require('./models');
require('./cron/appointmentReminder');
const userRoute=require('./routes/userRoute');
const serviceRoute=require('./routes/serviceRoute');
const availabilityRoute=require('./routes/availabilityRoute');
const staffRoute=require('./routes/staffRoute');
const appointmentRoute=require('./routes/appointmentRoute');
app.use(express.static('public'));
app.use(express.json());

// routes middleware
app.use('/api/users',userRoute);
app.use('/api/services',authenticateUser,serviceRoute);
app.use('/api/availability',authenticateUser,availabilityRoute);
app.use('/api/staff',authenticateUser,staffRoute);
app.use('/api/appointments',authenticateUser,appointmentRoute);
app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
    console.log(`server is listening on port ${process.env.PORT || 4000}`);
})
})
.catch((err)=>{
    console.log(err);
})