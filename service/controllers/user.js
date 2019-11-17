const { Router } = require('express');

const router = new Router();

// Add auth middleware
router.get('/me', (req, res) => {
  res.send({ user: req.user });
});

module.exports = router;
