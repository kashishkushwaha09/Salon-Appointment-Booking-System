const { AppError } = require("../utils/appError");
const Review=require('../models/reviewModel');

const addReview = async (req, res) => {
    try {
         const { serviceId, staffId, rating, comment } = req.body;
  const userId = req.user.id;

  const review = await Review.create({ userId, serviceId, staffId, rating, comment });
  res.status(201).json({ message: 'Review added', review });
    } catch (error) {
        console.log("Error in leaving reviews! ",error);
        throw new AppError("Error in leaving reviews!",500);
    }
};
 const replyToReview = async (req, res) => {
    try {
     const review = await Review.findByPk(req.params.id);
  if (!review)
    throw new AppError('Review not found',404)
    
  review.staffReply = req.body.reply;
  await review.save();

  res.status(200).json({ message: 'Reply added', review });   
    } catch (error) {
        console.log("Error in reply to reviews! ",error);
        throw new AppError("Error in reply to reviews!",500);
    }
  
};

module.exports={addReview,replyToReview};