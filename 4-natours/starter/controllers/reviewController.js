const Review = require('../models/reviewModel');
const controllerFactory = require('./controllerFactory');

// CRUD Operations:
exports.createReview = controllerFactory.createOne(Review);
exports.getAllReviews = controllerFactory.getAll(Review);
exports.getReview = controllerFactory.getOne(Review);
exports.updateReview = controllerFactory.updateOne(Review);
exports.deleteReview = controllerFactory.deleteOne(Review);

// For nested routes:
exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};
