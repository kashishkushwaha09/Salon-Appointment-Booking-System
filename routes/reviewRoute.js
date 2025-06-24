const express=require('express');
const router=express.Router();
const reviewController=require('../controllers/reviewController');
const protect=require('../middlewares/isStaff');
router.post('/',reviewController.addReview);

router.put('/:id',reviewController.updateReview);

// Staff replies to a review
router.put('/:id/reply', protect, reviewController.replyToReview);
router.delete('/:id',reviewController.deleteReview);
router.get('/',reviewController.getAllReviews);
module.exports=router;