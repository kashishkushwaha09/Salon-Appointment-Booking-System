
const serviceService=require('../services/serviceService');
const { AppError } = require('../utils/appError');

const addService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    if (!name || !duration || !price) {
        throw new AppError('Name, duration, and price are required',400);
    }
   const service=await serviceService.createService(name, description, duration, price);
    res.status(201).json({
      message: 'Service added successfully',
      service
    });
  } catch (error) {
      if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;
 
  }
};

const updateService=async(req,res)=>{
    try {
         const { id } = req.params;
    const { name, description, duration, price } = req.body;
    const service=await serviceService.updateService(id,{ name, description, duration, price });
     res.status(200).json({
      message: 'Service updated successfully',
      service
    });
    } catch (error) {
        if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;
    }
}
const deleteService=async(req,res)=>{
    try {
         const { id } = req.params;
         await serviceService.deleteService(id);
    res.status(200).json({ message: 'Service deleted successfully',success:true});
    } catch (error) {
       if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;  
    }
}
const getAllServices=async(req,res)=>{
       try {
        const services=await serviceService.getAllServices();
    res.status(200).json({
      message: 'Services fetched successfully',
      count: services.length,
      services
    });
    } catch (error) {
       if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;  
    }
}
const getServiceById=async(req,res)=>{
     try {
      const {id}=req.params;
        const service=await serviceService.getServiceById(id);
    res.status(200).json({
      message: 'Service fetched successfully',
      service
    });
    } catch (error) {
       if(!(error instanceof AppError)){
              error= new AppError(error.message, 500);;
             }
             throw error;  
    }
}
module.exports={addService,updateService,deleteService,getAllServices,getServiceById};