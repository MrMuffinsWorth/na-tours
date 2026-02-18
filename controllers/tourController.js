const Tour = require('./../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

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
    //FILTERTING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //query params = ?duration[gte]=5
    console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));
    // { difficulty: 'easy', duration: {$gte: 5 }} - mongo filter object

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');// query params = ?sort=price,ratingAverage
      query = query.sort(sortBy);
      // sort('price ratingAverage')
    } else {
      query.sort('-createdAt'); // default sort
    }

    //FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');//?fields=name,duration,difficulty,price
      //query = query.select('name duration price') called projecting
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //minus is excluding fields
    }

    //PAGINATION
    //query = query.skip(2).limit(5) // query params = ?page=2&limit=5
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
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
