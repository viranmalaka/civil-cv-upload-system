let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://127.0.0.1:27017/civil', {useNewUrlParser: true});

let usersRouter = require('./routes/users').router;
let batchRouter = require('./routes/batch');
let otherRouter = require('./routes/other');
let indexRouter = require('./routes/index');

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

app.use('/api/users', usersRouter);
app.use('/api/batch', batchRouter);
app.use('/api/other', otherRouter);
// app.get('/test', (req, res, next) => {
//
//   // let csv = require('csvtojson');
//   // let User = require('./models/User');
//   // let bcrypt = require('bcryptjs');
//   //
//   // let options = [
//   //   'Highway Engineering',
//   //   'Bridge',
//   //   'Resavor',
//   //   'Fluid',
//   //   'Building',
//   //   'Foundation',
//   // ];
//   //
//   // let i = 0, j = 0;
//   //
//   // User.find((err, users) => {
//   //   users.forEach(u => {
//   //     i += 5;
//   //     j += 7;
//   //     if(i % 6 === j % 6){
//   //       i += 1;
//   //     }
//   //     u.special = [options[i%6], options[j%6]];
//   //
//   //     u.save((e, r) => {
//   //       console.log(e, r.index);
//   //     });
//   //   });
//   // });
//
//
//     //
//     // csv().fromFile('routes/Civil-14-details.csv')
//     //   .then((jsonObj) => {
//     //     const createUser = (usr, next) => {
//     //       let password = 'test';
//     //
//     //       let hashedPassword = bcrypt.hashSync(password, 8);
//     //
//     //       User.create({
//     //         index: '140' + usr.Index,
//     //         name: usr.Fname,
//     //         type: 'uom',
//     //         batch: "5bb0c8a46be2cc5d4342ea96",
//     //         status: 'uom',
//     //         contactNo: usr.Tel.split('/'),
//     //         email: usr.Email.split('/'),
//     //         accountEmail: usr.Email.split('/')[0],
//     //         password: hashedPassword,
//     //         firstRowPassword: password,
//     //       }, next);
//     //     };
//     //
//     //     jsonObj.forEach(std => {
//     //       createUser(std, (err, std) => {
//     //         console.log(null, std.index);
//     //       })
//     //     });
//     //
//     //   });
//     res.end('sdf');
// });

app.use('*', indexRouter);


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
