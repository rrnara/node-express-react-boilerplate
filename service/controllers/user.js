const { Router } = require('express');
const passport = require('passport');

const router = new Router();

// Add auth middleware
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ user: req.user.response() });
});

module.exports = router;
