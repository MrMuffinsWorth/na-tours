const fs = require('fs');
const AppError = require('./utils/appError');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')

// Set security HTTP headers
app.use(helmet());

// Development loggin middlware - order is important
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests on API from same IP
const limiter = rateLimit({
  max: 100,  // 100 requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);


app.set('query parser', 'extended'); // required for advanced mongo url param filtering

// Body, parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // allows body to only be 10kb

// Serving static files
app.use(express.static(`${__dirname}/public`))

// Test middleware
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
