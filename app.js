var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var yelp = require('./lib/amenities/yelp.js');


var index = require('./routes/index');
var home = require('./routes/home');

var app = express();

app.use(yelp);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folders
app.use(express.static(path.join(__dirname, '/public')));
app.use('/tether', express.static(path.join(__dirname + '/bower_components/tether/dist/')));
app.use('/bootstrap', express.static(path.join(__dirname + '/bower_components/bootstrap/dist/')));
app.use('/jquery', express.static(path.join(__dirname + '/bower_components/jquery/dist/')));
app.use('/fontawesome', express.static(path.join(__dirname + '/bower_components/fontawesome/')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/', index);
app.use('/home', home);
app.use('/crime', home);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
