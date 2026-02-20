const slugify = require('slugify');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String, //schema type options
    required: [true, 'A tour must have a name!'], // value + error string
    unique: true,
    maxlength: [40, 'A tour name must have less than 40 characters'], // validators
    minlength: [10, 'A tour name must have more than 10 chatacters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'], // choices field
      message: 'Difficulty must be easy, medium, or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // defines a string array
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // hides from API output
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// cannot use virtual properties in queries
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// document middleware: runs before .save() and .create() or pre save hook
tourSchema.pre('save', function() {
  this.slug = slugify(this.name, { lower: true });
})

/*tourSchema.pre('save', function() {
  console.log('Will save document')
})

tourSchema.post('save', function(doc) {
  console.log(doc)
})*/

// query middleware
// will find all types of find methods
tourSchema.pre(/^find/, function() {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
})

tourSchema.post(/^find/, function(docs) {
  //console.log(docs);
  console.log(`Query took ${Date.now() - this.start} ms`);
})

// aggregation middleware
tourSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this)
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
