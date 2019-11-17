const { Router } = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

module.exports = function (app, db, config) {
  const apiRouter = new Router();
  apiRouter.use('/auth', authController(db, config));
  apiRouter.use('/users', userController);

  app.use('/api', apiRouter);
};
