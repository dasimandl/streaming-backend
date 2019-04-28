require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV !== 'production') require('../secrets');

const createServer = require('./createServer');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const server = createServer();
const app = server.express;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.use((req, res, next) => {
  // check for graphQL white whitelisted endpoints in path
  graphQLRegex = /(^\/)(graphql|playground|subscriptions)$/gi;
  req.isGraphQLEndpoint = graphQLRegex.test(req.path);
  next();
});

//  catch 404 and forward to error handler
app.use(function(req, res, next) {
  // override error handling for whitelisted graphql endpoints
  !req.isGraphQLEndpoint ? next(createError(404)) : next();
});

// error handler
app.use(function(err, req, res, next) {
  // override error handling for whitelisted graphql endpoints
  if (req.isGraphQLEndpoint) next();

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(cookieParser());

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
  },
  info => {
    console.log(`server is running on http://localhost:${info.port}`);
  }
);
