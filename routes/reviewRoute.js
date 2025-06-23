const express=require('express');
const router=express.Router();
const reviewController=require('../controllers/reviewController');
router.post('/',reviewController.addReview);
router.put('/:id/reply',reviewController.replyToReview);




module.exports=router;