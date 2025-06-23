const { AppError } = require("../utils/appError");
const staffService = require('../services/staff');

const addStaff = async (req, res) => {
    try {
        let { name,email,password,bio, specializations } = req.body;

        if (!name || !email || !password || !specializations) {
            throw new AppError('Name, email, password and specializations are required', 400);
        }

        const specArray = Array.isArray(specializations)
            ? specializations
            : specializations.split(',').map(s => s.trim());

        specializations = specArray;
        const newStaff = await staffService.addStaff(name,email,password,bio, specializations);

        res.status(201).json({
            message: 'Staff added successfully',
            staff: newStaff
        });
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
};
const getAll = async (req, res) => {
    try {
        const staffList = await staffService.getAll();
        res.status(200).json({
            message: 'Staffs fetched successfully',
            staff: staffList
        });
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);;
        }
        throw error;
    }
}
const updateStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        let { name, bio, specializations } = req.body;

        const specArray = Array.isArray(specializations)
            ? specializations
            : typeof specializations === 'string'
                ? specializations.split(',').map(s => s.trim())
                : staff.specializations;
        specializations = specArray;
        const staff = await staffService.updateStaff(staffId, name, bio, specializations);
        res.status(200).json({
            message: 'Staff updated successfully',
            staff
        });
    } catch (err) {
        console.error('Update staff error:', err);
        throw new AppError('Failed to update staff', 500);
    }
};
const assignServicesToStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { serviceIds } = req.body; // [1, 2, 3]

        if ( !Array.isArray(serviceIds) || serviceIds.length === 0) {
            throw new new AppError('Please provide at least one serviceId in array form', 400);
        }
        const validServiceIds = await staffService.assignServicesToStaff(staffId, serviceIds);
        res.status(200).json({
            message: 'Services successfully assigned based on skill and availability match.',
            staffId,
            assignedServices: validServiceIds
        });
    } catch (error) {
        console.error('Error assigning services to staff:', error);
        throw new AppError('Internal Server Error during service assignment', 500);
    }

}
module.exports = {
    addStaff, getAll, updateStaff, assignServicesToStaff
}