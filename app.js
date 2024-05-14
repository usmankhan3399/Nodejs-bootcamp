//  app.js we actually  used for middelware declaration
//in our app.js  we have all the midelwares we want to apply to all the routes

const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// 1--------------------------------- MIDDLEWARES  ---------------------------
if (process.env.NODE_ENV === 'development') {
  //we are doing it to only run the loger midleware to only define it when we are actually in development so the logger will not run when we are in production
  // 3rd party middware
  app.use(morgan('dev'));
}
//this is a  middleware
app.use(express.json());
//simple builtin middelware used for serving static files without api or something else just wanna run overview.html
//we can directly reun this url http://127.0.0.1:3000/overview.html in browser to see the reults of static file i.e overview.html
app.use(express.static(`${__dirname}/public`));

//1st custom  middleware
// app.use((req, res, next) => {
//   console.log('hello from the middleware 👋');
//   next();
// });

//2nd custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//mounting the routes

app.use('/api/v1/tours', tourRouter); //in this line tourRouter is a middelware i.e we want to apply on the route stated in this line
app.use('/api/v1/users', userRouter); //in this line userRouter is a middelware i.e we want to apply on the route stated in this line

//NOTE: the tourRouter and userRouter are middelware that is why we used app.use in order to mount them

app.all('*', (req, res, next) => {
  // // all means get,post,update,delete all and * means all urls
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server !`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server !`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
