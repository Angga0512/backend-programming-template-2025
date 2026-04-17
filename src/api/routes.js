const express = require('express');

const auth = require('./components/auth/auth-route');
const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
const gacha = require('./components/gacha/gacha-route');

module.exports = () => {
  const app = express.Router();

  auth(app);
  books(app);
  users(app);
  gacha(app);

  return app;
};
