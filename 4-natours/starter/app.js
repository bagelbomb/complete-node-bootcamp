const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// TODO: fix ESLint/SonarLint errors throughout application

const app = express();

// Set views:
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files:
app.use(express.static(path.join(__dirname, 'public')));

// Enable proxies (for Heroku):
app.enable('trust proxy');

// Implement CORS:
app.use(cors());
app.options('*', cors());

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

// Cookie parser:
app.use(cookieParser());

// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

// Compress text responses:
app.use(compression());

// Routes:
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Undefined routes:
app.all('*', (req, res, next) => {
  next(new AppError(`The route: ${req.originalUrl} cannot be found`, 404));
});

// Error handling:
app.use(globalErrorHandler);

module.exports = app;
