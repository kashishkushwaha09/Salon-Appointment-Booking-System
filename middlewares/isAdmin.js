const User=require('../models/userModel');
const { AppError } = require('../utils/appError');
module.exports=async(req,res,next)=>{
    try {
       const user = await User.findByPk(req.user.id);
if(!user){
   throw new AppError("User not found",404); 
}
if(user.role!=='admin'){
  throw new AppError("Access denied:- you are not admin",403);
}
next(); 
    } catch (error) {
         if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;
 
    }


}