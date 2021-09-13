const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const { upload } = require('./middleware')
const fs = require('fs');

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

router.post('/update', upload, async (req, res) => {
  const {email, name, birth, phoneNumber, image} = req.body;
  let new_image = '';
  if(req.file){
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/profile/' + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  }else{
    new_image = req.body.old_image;
  }
  const newUser = {email, name, birth, phoneNumber, image:new_image};
  try {
    await User.findOneAndUpdate(email, newUser);
    res.status(200).json({message: '프로필을 업데이트 하셨습니다.'})
  } catch (err) {
    res.status(404).json({message: err.message});
  }
})

module.exports = router;