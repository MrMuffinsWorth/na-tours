const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// middlware - order is important
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.set('query parser', 'extended'); // required for advanced mongo url param filtering

app.use(express.json());

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// creates a sub application = mouting the router
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

// catches all requests not handled by our routes (does not use the old regex pattern '*' to match)
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server.`
  })
  next();
})
// runs for all http methods
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour)
//app.patch('/api/v1/tours/:id', updateTour)
//app.delete('/api/v1/tours/:id', deleteTour)

module.exports = app;
