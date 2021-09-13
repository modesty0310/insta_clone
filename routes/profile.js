const express = require('express');
const passport = require('passport');
const User = require('../models/User');

require('dotenv').config();

const router = express.Router();
router.get('/',async (req,res,next) => {
  passport.authenticate('jwt',(err, user) => {
    if(user) {
      User.findOne({email: user.email})
        .then(result => res.json({result}))
        .catch(err => err);
        return;
    }
    return res.json({message: "인증되지 않은 사용자"});
  })(req, res, next)
});

module.exports = router;