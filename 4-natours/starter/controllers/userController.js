const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};

  allowedFields.forEach(field => {
    if (obj[field]) {
      filteredObj[field] = obj[field];
    }
  });

  return filteredObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

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

// exports.getUser = (req, res) => {
//   const user = users.find(u => u._id === req.params.id);

//   res.status(200).json({
//     status: 'success',
//     data: { user },
//   });
// };

// exports.createUser = (req, res) => {
//   const newUser = { ...req.body };

//   users.push(newUser);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/users.json`,
//     JSON.stringify(users),
//     err => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           user: newUser,
//         },
//       });
//     }
//   );
// };

// exports.updateUserPut = (req, res) => {
//   const userIndex = users.findIndex(u => u._id === req.params.id);

//   users[userIndex] = { ...req.body };

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/users.json`,
//     JSON.stringify(users),
//     err => {
//       res.status(200).json({
//         status: 'success',
//         data: {
//           user: users[userIndex],
//         },
//       });
//     }
//   );
// };

// exports.updateUserPatch = (req, res) => {
//   const userIndex = users.findIndex(u => u._id === req.params.id);

//   users[userIndex] = { ...users[userIndex], ...req.body };

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/users.json`,
//     JSON.stringify(users),
//     err => {
//       res.status(200).json({
//         status: 'success',
//         data: {
//           user: users[userIndex],
//         },
//       });
//     }
//   );
// };

// exports.deleteUser = (req, res) => {
//   const userIndex = users.findIndex(u => u._id === req.params.id);

//   users.splice(userIndex, 1);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/users.json`,
//     JSON.stringify(users),
//     err => {
//       res.status(204).json({
//         status: 'success',
//         data: null,
//       });
//     }
//   );
// };
