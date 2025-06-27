const express=require('express');
const router=express.Router();
const authUser=require('../middlewares/authenticateUser');
const paymentController=require('../controllers/paymentController');
router.post('/create-order',authUser,paymentController.createOrder);
router.get('/status/:orderId',authUser,paymentController.getPaymentStatus);


module.exports=router;