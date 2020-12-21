var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodeGeocoder = require('node-geocoder');

var indexRouter = require('./routes/mailer');
var contactsRouter = require('./routes/contacts');
var usersRouter = require('./routes/users');
var dbRouter = require('./routes/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* *********************************set up connection to database************************************************* */
app.use(async (req, res, next) => {
  await dbRouter.SetConnection();
  next();
});

/* *********************************set up attributes for geocoding************************************************* */
const geocoder = nodeGeocoder({provider: 'openstreetmap'});
app.use((req,res, next) => {
  req.geocoder = geocoder;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/contacts', contactsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;