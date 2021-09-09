const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req,res,next) => {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      if(passportError || !user) {
        res.status(500).json({message : info.reason});
        return;
      }

      req.login(user, {session: false}, loginError => {
        if(loginError){
          res.send(loginError);
          return;
        }
      })

      const token = jwt.sign({id:user.email, name: user.name}, process.env.JWT_SECRET);
      res.json({token})
    })(req,res)
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;