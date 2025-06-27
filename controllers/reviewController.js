const { AppError } = require("../utils/appError");
const Review=require('../models/reviewModel');
const Appointment=require('../models/appointmentModel');
const Service=require('../models/serviceModel');
const Staff=require('../models/staffModel');
const User=require('../models/userModel');
const addReview = async (req, res) => {
    try {
         const { appointmentId, rating, comment } = req.body;

   const userId = req.user.id;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.userId !== userId)
      throw new AppError('Invalid appointment', 400);

    const existing = await Review.findOne({ where: { appointmentId } });
    if (existing)
      throw new AppError('Review already submitted for this appointment', 400);

  const review = await Review.create({
      appointmentId,
      userId,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      rating,
      comment
    });
  res.status(201).json({ message: 'Review added', review });
    } catch (error) {
        console.log("Error in leaving reviews! ",error);
        throw new AppError("Error in leaving reviews!",500);
    }
};
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review || review.userId !== userId)
      throw new AppError('Review not found or unauthorized', 404);

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({ message: 'Review updated', review });
  } catch (err) {
    console.error("Error updating review:", err);
    throw new AppError('Failed to update review', 500);
  }
};
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review || review.userId !== userId)
      throw new AppError('Review not found or unauthorized', 404);

    await review.destroy();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    throw new AppError('Failed to delete review', 500);
  }
};
 const replyToReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reply = req.body.reply;
if (req.user.role !== 'staff' && req.user.role !== 'admin') {
  throw new AppError('Unauthorized to reply to reviews', 403);
}
    if (!reply) {
      throw new AppError('Reply cannot be empty', 400);
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    review.staffReply = reply;
    await review.save();

    res.status(200).json({ message: 'Reply added to review', review });
  } catch (error) {
    console.error('Error in replyToReview:', error);
    throw new AppError('Error replying to review', 500);
  }
};
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Service },
        { model: Staff },
        { model: User, attributes: ['name', 'email'] }
      ]
    });

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error fetching reviews ", err);
   throw new AppError('Failed to fetch reviews',500);
  }
};
const getReviewByAppointment = async (req, res) => {
  try {
    const { id } = req.params;
     const review = await Review.findOne({
      where: { appointmentId:id },
      include: [
        { model: Service },
        { model: Staff },
        { model: User, attributes: ['name', 'email'] }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ message: "Review not found for this appointment" });
    }
    res.status(200).json({ review });
  } catch (err) {
   console.error("Error fetching review by appointmentId:", err);
   throw new AppError('Failed to fetch review',500);
  }
};

module.exports={addReview,updateReview,deleteReview,replyToReview,getAllReviews,getReviewByAppointment};