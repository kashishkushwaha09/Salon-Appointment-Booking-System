const express=require('express');
const router=express.Router();
const upload=require('../middlewares/multerConfig');
const userController=require('../controllers/userController');
router.post('/register',upload.single('avatar'),userController.signUpUser);
router.post('/login',userController.loginUser);




module.exports=router;