var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");


var index = require('./routes/index');
var users = require('./routes/users');
var mission = require('./routes/mission');
var group = require('./routes/group');
var wechat = require('./routes/wechat');

var app = express();


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: "a"})
// setup the logger
app.use(logger("combined", {stream: accessLogStream}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res,next){
    var ip = req.connection.remoteAddress;
    console.log(ip);
    next();
});

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret',
//    cookie: {maxAge: 1000 * 60 * 60,expires:1000 * 60 * 5},
    rolling: true
}));

app.use('/api',function(req, res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var token = req.body.token || req.query.token;
    console.log(token)
    var session = global.sessionMap.get(token);
    if (session) {
        next();
    } else {
        res.send({success:false,message:'需要登录',code:-1});
    }
});

app.use('/', index);
app.use('/api/users', users);
app.use('/api/mission', mission);
app.use('/api/group', group);
app.use('/api/wechat', wechat);



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

var server = app.listen(7070, function() {
  console.log("listen at 7070");
});
