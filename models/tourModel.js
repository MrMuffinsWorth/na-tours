const slugify = require('slugify');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String, //schema type options
    required: [true, 'A tour must have a name!'], // value + error string
    unique: true
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
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
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
  startDates: [Date]
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
