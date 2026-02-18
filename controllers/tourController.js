const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    /*const tours = await Tour.find({
      duration: 5,
      difficulty: 'easy'
    })*/
    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    const queryObj = { ...req.query };// shallow copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //console.log(req.query, queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));
    // { difficulty: 'easy', duration: {$gte: 5 }} - mongo filter object

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
      // sort('price ratingAverage')
    }

    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `${err}`
    })
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      tour: tour
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `${err}`
    })
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error creating tour: ${err}`
    });
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after', // will return the new document not the original one
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error updating tour: ${err}`
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error deleting tour: ${err}`
    });
  }
};
