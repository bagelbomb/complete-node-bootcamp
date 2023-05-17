const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.checkId = (req, res, next, val) => {
  if (!users.some(u => u.id === +val)) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body._id || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing ID or name'
    });
  }

  next();
};

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
};

exports.getUser = (req, res) => {
  const user = users.find(u => u._id === req.params.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
};

exports.createUser = (req, res) => {
  const newUser = { ...req.body }

  users.push(newUser);

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    }
  );
};

exports.updateUserPut = (req, res) => {
  const userIndex = users.findIndex(u => u._id === req.params.id);

  users[userIndex] = { ...req.body };

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(200).json({
        status: 'success',
        data: {
          user: users[userIndex],
        },
      });
    }
  );
};

exports.updateUserPatch = (req, res) => {
  const userIndex = users.findIndex(u => u._id === req.params.id);

  users[userIndex] = { ...users[userIndex], ...req.body };

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(200).json({
        status: 'success',
        data: {
          user: users[userIndex],
        },
      });
    }
  );
};

exports.deleteUser = (req, res) => {
  const userIndex = users.findIndex(u => u._id === req.params.id);

  users.splice(userIndex, 1);

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};