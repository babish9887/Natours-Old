const express = require('express');
const morgan = require('morgan');
const rateLimit =require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const path=require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const viewRouter=require('./routes/viewRoutes')

const app = express();

app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));



const limiter=rateLimit({
  max: 500,
  windowMs: 60*60*1000,
  message: 'Too many requests from this IP',  
});
app.use('/api', limiter);

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

app.use(xss());
// prevent parameter pollution
app.use(hpp());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('',viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
