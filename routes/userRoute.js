const express=require('express');
const router=express.Router();
const upload=require('../middlewares/multerConfig');
const userController=require('../controllers/userController');
const customerController=require('../controllers/customerController');
const authenticateUser=require('../middlewares/authenticateUser');
const isAdmin=require('../middlewares/isAdmin');
router.post('/register',upload.single('avatar'),userController.signUpUser);
router.post('/login',userController.loginUser);
router.get('/users',authenticateUser,isAdmin, customerController.getAllUsers);
router.get('/me',authenticateUser,customerController.getProfile);
router.put('/update',authenticateUser,customerController.updateProfile);
router.delete('/delete',authenticateUser,customerController.deleteProfile);

module.exports=router;