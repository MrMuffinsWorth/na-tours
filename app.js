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
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err); // if next has a function argument it knows there is an error and sends to the global error middleware
})

// express knows that this is an error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

module.exports = app;
