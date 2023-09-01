const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.error(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION - Shutting down...');

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB_CONNECTION_STRING = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.error(err.name, err.message);
  console.log('UNHANDLED REJECTION - Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM Received. Shutting down gracefully...');

  server.close(() => {
    console.log('Process terminated.');
  });
});
