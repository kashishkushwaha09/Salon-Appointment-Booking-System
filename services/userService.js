const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const User=require('../models/userModel');
const { AppError } = require('../utils/appError');

const findByEmail=async(email)=>{
    try {
        const user=await User.findOne({where:{email:email}});
        return user;
    } catch (error) {
        throw new AppError(error.message,500);
    }
}
const signUpUser=async(userData)=>{  
    // name,email,password,role
    try {
          // Check if the user already exists
                const existingUser=await findByEmail(userData.email);
                if(existingUser){
                    throw new AppError("User already exists", 409);
                }
        const hashPassword=await bcrypt.hash(userData.password,10);
        userData.password=hashPassword;
        const user=await User.create(userData);
        return user;
    } catch (error) {
       throw new AppError(error.message,500);
    }
}
const loginUser=async(password,existingUser)=>{
    try {
         
        const isPasswordMatched=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordMatched){
            return null;
        }
        const token=jwt.sign(
            {userId:existingUser.id,email:existingUser.email},
            process.env.SECRET_KEY,
            {expiresIn:'7d'}
        );
        return token;
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, 500);
    }
}
module.exports={
    signUpUser,loginUser,findByEmail
}