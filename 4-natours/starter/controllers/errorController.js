const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/"(.*?)"/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errorMessages = Object.values(err.errors).map(e => e.message);
  const message = `Invalid input data: ${errorMessages.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational, trusted errors: send message to client

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details

    console.error('ERROR: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let prodError = { ...err };

    if (err.name === 'CastError') {
      prodError = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      prodError = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'ValidationError') {
      prodError = handleValidationErrorDB(err);
    }

    sendErrorProd(prodError, res);
  }
};
