//for connecting our config file with our node app we use npm package dotenv because our .env file contains simple text and node js
// has no way of knowing that these variables are there.

const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' }); //we passed the object to specify the path where our config file is located
// this command willl read variables from the config file and save them into nodejs environment variables
const app = require('./app');

console.log(app.get('env'));
//('env) => environment variables are global variables
// that are used to define the environment in which a node app is running

// console.log(process.env); // this is used for log all the environment variables set by node and it is need internally by node

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

dbConnect();
// .catch((err) => console.log(err));

async function dbConnect() {
  //for localhost
  // await mongoose.connect(process.env.DATABASE_LOCAL);

  await mongoose.connect(DB);
  // console.log(mongoose.connections); //this is for seeing the connection
  console.log('DB Connection Successfull ');
}
//for setting our own environment variables through terminal we use this command in terminal $env:NODE_ENV='development';$env:Z='50';  nodemon server.js
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥💥 Shutting down......');
  server.close(() => {
    process.exit(1);
  });
});
