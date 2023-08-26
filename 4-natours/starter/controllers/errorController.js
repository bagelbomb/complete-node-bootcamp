const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateReviewDB = () => {
  const message =
    'You have already created a review on this tour. You can only create one review per tour.';

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

const handleJWTInvalidError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Expired token. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Rendered Website
  console.error('ERROR: ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted errors: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    console.error('ERROR: ', err);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }

  // Rendered Website
  // Operational, trusted errors: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR: ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let prodError = { ...err, message: err.message };

    if (err.name === 'CastError') {
      prodError = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      if (err.message.includes('tour_1_user_1')) {
        prodError = handleDuplicateReviewDB();
      } else {
        prodError = handleDuplicateFieldsDB(err);
      }
    }

    if (err.name === 'ValidationError') {
      prodError = handleValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      prodError = handleJWTInvalidError();
    }

    if (err.name === 'TokenExpiredError') {
      prodError = handleJWTExpiredError();
    }

    sendErrorProd(prodError, req, res);
  }
};
