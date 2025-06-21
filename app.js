require('dotenv').config();
const fs=require('fs');
const path=require('path');
const express=require('express');
const app=express();
const db=require('./utils/db-connection');
const errorMiddleware=require('./middlewares/errorHandler');
const userRoute=require('./routes/userRoute');

app.use(express.static('public'));
app.use(express.json());

// routes middleware
app.use('/api/users',userRoute);
app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
    console.log(`server is listening on port ${process.env.PORT || 4000}`);
})
})
.catch((err)=>{
    console.log(err);
})