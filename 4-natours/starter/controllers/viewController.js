const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// TODO: migrate to React

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// TODO: if a user has taken a tour, let them add a review for it on the tour details page
// TODO: hide the booking section on the tour details page if the user has already booked the tour (also prevent duplicated bookings on the model)?
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

// TODO: implement functionality to like tours and a favorite tours page to display them

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

// TODO: implement the My Reviews page where the user's reviews are displayed and can be edited
// TODO: for admins, implement the Manage page where they can CRUD tours, users, reviews, and bookings
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id });

  const tourIds = bookings.map(b => b.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // TODO: create an actual my-tours page with the /me container and different cards
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
