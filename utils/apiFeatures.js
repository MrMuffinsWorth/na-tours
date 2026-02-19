class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //FILTERTING
    const queryObj = { ...this.queryString };// shallow copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //query params = ?duration[gte]=5
    // { difficulty: 'easy', duration: {$gte: 5 }} - mongo filter object

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');// query params = ?sort=price,ratingAverage
      this.query = this.query.sort(sortBy);
      // sort('price ratingAverage')
    } else {
      this.query = this.query.sort('-createdAt'); // default sort
    }
    return this;
  }

  limitFields() {
    //FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');//?fields=name,duration,difficulty,price
      //query = query.select('name duration price') called projecting
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //minus is excluding fields
    }
    return this;
  }

  paginate() {
    //PAGINATION
    //query = query.skip(2).limit(5) // query params = ?page=2&limit=5
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
