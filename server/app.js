let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://127.0.0.1:27017/civil', {useNewUrlParser: true});

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users').router;
let batchRouter = require('./routes/batch');
let otherRouter = require('./routes/other');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/batch', batchRouter);
app.use('/api/other', otherRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.jsonp({success: false, error: err});
    res.end();
    // res.render('error');
});

module.exports = app;
