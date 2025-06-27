const express=require('express');
const router=express.Router();
const reviewController=require('../controllers/reviewController');
const protect=require('../middlewares/isStaff');
const isAdmin=require('../middlewares/isAdmin');
router.post('/',reviewController.addReview);

router.put('/:id',reviewController.updateReview);

// Staff replies to a review
router.put('/:id/reply', reviewController.replyToReview);
router.delete('/:id',reviewController.deleteReview);
router.get('/',reviewController.getAllReviews);
router.get('/:id',reviewController.getReviewByAppointment);
module.exports=router;