const { Router } = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

module.exports = function (app) {
  const apiRouter = new Router();
  apiRouter.use('/auth', authController());
  apiRouter.use('/users', userController);

  app.use('/api', apiRouter);
};
