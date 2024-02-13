const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require("express-session")
const passport = require("passport")
const mongoose = require("mongoose")
require("dotenv").config()

const mongoDb = process.env.LOG_IN
mongoose.connect(mongoDb)
const db = mongoose.connection
db.on("error", console.error.bind(console, "mongo connection error"))

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog");

const app = express();

require("./routes/auth")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const sessionStore = new MongoStore({ mongooseConnection: db, collection: 'sessions' })

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  // store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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
