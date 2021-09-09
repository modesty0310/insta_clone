const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/join', async (req, res, next) => {
  const {email, password, chk_password, name, birth, gender, phoneNumber} = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "이미 존재하는 아이디 입니다."});
    }
    if(password !== chk_password) {
      return res.status(500).json({message: "비밀번호가 일치하지 않습니다."})
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email, 
      password: hash, 
      name, 
      birth, 
      gender, 
      phoneNumber
    });
    res.status(201).json({message: "회원가입이 완료 되었습니다."});
  } catch (err) {
    res.status(400).json({message: err.message});
  }
  
})

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