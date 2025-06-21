const express=require('express');
const router=express.Router();
const isAdmin=require('../middlewares/isAdmin');

const serviceController=require('../controllers/serviceController');
const availabilityController=require('../controllers/availabilityController');
router.get('/',isAdmin,serviceController.getAllServices);
router.post('/',isAdmin,serviceController.addService);
router.put('/:id',isAdmin,serviceController.updateService);
router.delete('/:id',isAdmin,serviceController.deleteService);
router.post('/:id/availability',isAdmin,availabilityController.setAvailability);
router.get('/:id/availability',availabilityController.getAvailability);

module.exports=router;