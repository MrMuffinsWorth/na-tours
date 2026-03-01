const AppError = require('./../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// API level defense for ensuring that the reviews are in the correct shape
const trimPopulatedReview = review => {
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
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  // doing the lean and populate here are a better way to select the fields that are wanted from the route instead of a mongoose pre function on the find methods
  const reviews = await features.query
    .lean() // converts the query results into a plain JS object
    .populate({ // populate in the controller avoids mongoose schema version weirdness
      path: 'tour',
      select: { name: 1 }
    })
    .populate({
      path: 'user',
      select: { name: 1, photo: 1 }
    });

  reviews.forEach(trimPopulatedReview);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  })
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .lean()
    .populate({
      path: 'tour',
      select: { name: 1 }
    })
    .populate({
      path: 'user',
      select: { name: 1, photo: 1 }
    });
  if (!review) return next(new AppError('No review found with that ID.', 404));

  trimPopulatedReview(review);
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  })
});
