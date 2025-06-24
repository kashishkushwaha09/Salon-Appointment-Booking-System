const express=require('express');
const router=express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');

router.get('/customers',isAdmin, adminController.getAllUsers);
router.put('/customers/:id',isAdmin, adminController.updateUser);
router.delete('/customers/:id',isAdmin, adminController.deleteUser);


module.exports=router;