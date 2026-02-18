const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful'));

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

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
})

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.error('ERROR: ', err)
})

// local db version
//mongoose.connect(process.env.DATABASE_LOCAL).then(() => console.log('DB connection successful'));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})

module.exports = app;
