const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Global Error Handling
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection. Server shutting down.');
  console.log(err.stack)
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.log('Uncaught Exception. Server shutting down.');
  console.log(err.stack)
  process.exit(1);
})
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful'));

// local db version
//mongoose.connect(process.env.DATABASE_LOCAL).then(() => console.log('DB connection successful'));
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})


