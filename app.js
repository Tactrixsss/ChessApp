var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient
const fileUpload = require('express-fileupload')

//routes we are binding
var indexRouter = require('./views/index');
var usersRouter = require('./routes/api/v1/Users');
var chessOpeningsRouter = require('./routes/api/v1/ChessOpenings');

const cors = require('cors')
const url = 'mongodb+srv://NormalAccess:H3lioTr%40ining@cluster0-wiggy.mongodb.net/test?retryWrites=true&w=majority'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let app = client.connect()
  .then(connection => {

    const app = express();
    app.locals.collectionOpenings = connection.db('chessmoves').collection("openings")
    app.locals.collectionUsers = connection.db('chessmoves').collection("users")
    //H3lioTr%40ining//
    //mongodb+srv://NormalAccess:<H3lioTr%40ining>@cluster0-wiggy.mongodb.net/test?retryWrites=true&w=majority//
    // view engine setup

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    //
    app.use(cors())
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'react')));
    app.use(fileUpload())
    // first param is the route, second param is the function that is called for that route
    app.use('/', indexRouter);
    app.use('/api/v1/users', usersRouter);
    app.use('/api/v1/chessopenings', chessOpeningsRouter);
    //  '/' = https://localhost:3000/ == root route
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    return app
      
      
    
  }) // end of then
.catch ((err) => {
  console.log('not connected')
  console.log(err.stack);
})

module.exports = app;

