var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var feedRouter = require('./routes/feed');
var eventosRouter = require('./routes/eventos');
var guiaifRouter = require('./routes/guiaif');
var menuRouter = require('./routes/menu');
var secjacRouter = require('./routes/secjac');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', feedRouter);
app.use('/eventos', eventosRouter);
app.use('/guiaif', guiaifRouter);
app.use('/menu', menuRouter);
app.use('/secjac', secjacRouter);

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
