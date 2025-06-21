const { AppError } = require("../utils/appError");
const userService=require('../services/userService');


const signUpUser=async(req,res)=>{  
    const {name,email,password,role}=req.body;
    try {
      
        const newUser=await userService.signUpUser({name,email,password,role});
        if(!newUser){
            throw new AppError("Error creating user", 500);
        }
        return res.status(201).json({
            message:"user created successfully"
        })
    } catch (error) {
        console.log(error);
             if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;
    }
}
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const existingUser=await userService.findByEmail(email);
                if(!existingUser){
                    throw new AppError("User not Found",404)
                }
        const token=await userService.loginUser(password,existingUser);
        if(!token){
            throw new AppError("Invalid Credentials", 401);
        }
        const {id,name,email:useremail,role}=existingUser;
        return res.status(200).json({message:"Login Successful",token,success:true,user:{id,name,email:useremail,role}})
    } catch (error) {
       console.log(error);
             if(error instanceof AppError){
               throw error;
             }
             throw new AppError(error.message, 500);
    }
}

module.exports={signUpUser,loginUser};