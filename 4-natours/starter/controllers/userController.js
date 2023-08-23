const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObject');
const controllerFactory = require('./controllerFactory');

// CRUD Operations:
exports.createUser = (req, res) => {
  // TODO: Actually define this (for admins) or get rid of it
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use /signup instead.',
  });
};
exports.getAllUsers = controllerFactory.getAll(User);
exports.getUser = controllerFactory.getOne(User);
exports.updateUser = controllerFactory.updateOne(User); // Do not update passwords with this
exports.deleteUser = controllerFactory.deleteOne(User);

// For GET /me:
exports.setUserId = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route cannot be used to update passwords. Please use /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deactivateMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
