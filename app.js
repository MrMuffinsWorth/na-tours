const fs = require('fs');
const AppError = require('./utils/appError');
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')

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
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404); // if next has a function argument it knows there is an error and sends to the global error middleware
})

app.use(globalErrorHandler)

module.exports = app;
