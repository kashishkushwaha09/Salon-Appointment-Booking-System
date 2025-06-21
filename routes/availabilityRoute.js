const express=require('express');
const router=express.Router();
const isAdmin=require('../middlewares/isAdmin');


const availabilityController=require('../controllers/availabilityController');

router.put('/:id',isAdmin,availabilityController.updateAvailability);
router.delete('/:id',isAdmin,availabilityController.deleteAvailability);

module.exports=router;