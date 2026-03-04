const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const express = require('express');

const router = express.Router({ mergeParams: true }); // mergeParams will grab the params from the tour router if the request goes through there first

router.use(authController.protect);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview)

router.route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('admin', 'user'), reviewController.updateReview)
  .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)

module.exports = router
