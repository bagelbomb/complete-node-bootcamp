const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Set security HTTP headers:
app.use(helmet());

// Development logging:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting:
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again later.',
});

app.use('/api', limiter);

// JSON body parser:
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection:
app.use(mongoSanitize());

// Data sanitization against XSS:
app.use(xss());

// Prevent parameter pollution:
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serve static files:
app.use(express.static(`${__dirname}/public`));

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
