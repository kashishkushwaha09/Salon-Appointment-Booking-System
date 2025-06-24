const { AppError } = require("../utils/appError");
const Service = require('../models/serviceModel');

const createService = async (name, description, duration, price) => {
    try {
        const existing = await Service.findOne({ where: { name } });
        if (existing) {
            throw new AppError('Service already exists with this name', 409);
        }
        const service = await Service.create({
            name,
            description,
            duration: parseInt(duration),
            price: parseFloat(price)
        });
        return service;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const updateService = async (id, serviceObj) => {
    try {
        const { name, description, duration, price } = serviceObj;
        const service = await Service.findByPk(id);
        if (!service) {
            throw new AppError('Service not found', 404);
        }
        if (name && name !== service.name) {
            const nameExists = await Service.findOne({ where: { name } });
            if (nameExists) {
                throw new AppError('Another service with this name already exists', 409);
            }
        }
        await service.update({ name, description, duration, price });
        return service;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const deleteService = async (id) => {
    try {
        const service = await Service.findByPk(id);
        if (!service) {
            throw new AppError('Service not found', 404);
        }
        await service.destroy();
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }

}
const getAllServices=async()=>{
  try {
        const services = await Service.findAll();
        return services;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }

}
const getServiceById=async(id)=>{
    try {
        const service = await Service.findByPk(id);
        return service;
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
module.exports = {
    createService, updateService, deleteService,getAllServices,getServiceById
}