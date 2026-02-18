const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String, //schema type options
    required: [true, 'A tour must have a name!'], // value + error string
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!']
  }
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
