const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const express = require('express');

const router = express.Router({ mergeParams: true }); // mergeParams will grab the params from the tour router if the request goes through there first

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

router.route('/:id')
  .get(reviewController.getReview)

module.exports = router
