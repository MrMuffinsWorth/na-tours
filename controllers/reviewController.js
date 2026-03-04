const AppError = require('./../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// API level defense for ensuring that the reviews are in the correct shape
/*const trimPopulatedReview = review => {
  if (!review) return review;

  if (review.tour && typeof review.tour === 'object' && !Array.isArray(review.tour)) {
    review.tour = {
      _id: review.tour._id,
      name: review.tour.name
    };
  }

  if (review.user && typeof review.user === 'object' && !Array.isArray(review.user)) {
    review.user = {
      _id: review.user._id,
      name: review.user.name,
      photo: review.user.photo
    };
  }

  return review;
};*/

exports.getAllReviews = factory.getAll(Review, { path: 'user', select: { name: 1, photo: 1 } });
exports.getReview = factory.getOne(Review);

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; // this is for when the route does not have the tour just the /reviews route
  if (!req.body.user) req.body.user = req.user.id; // this is for when the user is not specified it pulls it from the auth middleware since it is protected
  next();
}

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
