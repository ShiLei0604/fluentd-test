var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var logger = require('fluent-logger');
logger.configure('fluentd.test', {
  host: 'localhost',
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000 // 10 minutes
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.get('/', function(req, res){
  logger.emit('fellow', {from: 'userA', to: 'uesrB'});
  //undefined();
  res.send('Fluent Test');
})

//errorテスト
app.get('/err', function(req, res){
  undefined();
  res.json({'test':'test'})
})

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
  //console.log('エラー'+err.stack);
  logger.emit('error:', {'Something went wrong:':err.stack});

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
