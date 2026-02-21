const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('ERROR: ', err);
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went very wrong.'
    })
  }
}

// express knows that this is an error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if (process.end.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.end.NODE_ENV === 'development') {
    sendErrorProd(err, res);
  }
};
