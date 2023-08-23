const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const controllerFactory = require('./controllerFactory');

const earthRadiusMiles = 3963.2;
const earthRadiusKilometers = 6378.1;
const meterToMileMultiplier = 0.000621371;
const meterToKilometerMultiplier = 0.001;

// CRUD Operations:
exports.createTour = controllerFactory.createOne(Tour);
exports.getAllTours = controllerFactory.getAll(Tour);
exports.getTour = controllerFactory.getOne(Tour, { path: 'reviews' });
exports.updateTour = controllerFactory.updateOne(Tour);
exports.deleteTour = controllerFactory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, coordinate, unit } = req.params;
  const [latitude, longitude] = coordinate.split(',');
  const radius =
    unit === 'mi'
      ? distance / earthRadiusMiles
      : distance / earthRadiusKilometers;

  if (!latitude || !longitude) {
    next(
      new AppError(
        'Please provide the center point in the format: "latitude,longitude".',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { coordinate, unit } = req.params;
  const [latitude, longitude] = coordinate.split(',');

  const multiplier =
    unit === 'mi' ? meterToMileMultiplier : meterToKilometerMultiplier;

  if (!latitude || !longitude) {
    next(
      new AppError(
        'Please provide the center point in the format: "latitude,longitude".',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+longitude, +latitude],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
