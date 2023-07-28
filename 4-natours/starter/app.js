const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Development logging:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Resource routes:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Undefined routes:
app.all('*', (req, res, next) => {
  next(new AppError(`The route: ${req.originalUrl} cannot be found`, 404));
});

// Error handling:
app.use(globalErrorHandler);

module.exports = app;
