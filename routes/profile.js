const express = require('express');
const passport = require('passport');

require('dotenv').config();

const router = express.Router();
router.get('/', async (req, res) => {
  passport.authenticate('jwt', { session: false },(err, user) => {
  if(user) {
    return res.json({ result: true, user });
  }
  return res.json({mesage: "잘못된 인증정보"})
  })(req, res)
});

module.exports = router;