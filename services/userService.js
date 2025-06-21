const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const AWS=require('aws-sdk');
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
function uploadToS3(data,fileName,mimetype){
      const BUCKET_NAME='salonbooking809702558620';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    const s3=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    });

    const params={
        Bucket:BUCKET_NAME,
        Key:fileName,
        Body:data,
        ContentType:mimetype,
        ACL:'public-read',
    }
     return s3.upload(params).promise();
}
const signUpUser=async(userData)=>{  
    // name,email,password,role
    try {
          if (userData.avatarUrl && userData.avatarUrl.buffer) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const fileName = `${timestamp}-${userData.avatarUrl.originalname}`;
  const fileBuffer = userData.avatarUrl.buffer;
  const mimetype=userData.avatarUrl.mimetype;
  const response = await uploadToS3(fileBuffer,fileName,mimetype);
  userData.avatarUrl = response.Location;
}
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