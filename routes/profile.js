const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/profile');
  },
  filename : function(req, file, cb){
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
  },
})

let upload = multer({
  storage:storage
}).single('image');

router.get('/', async (req, res) => {
  passport.authenticate('jwt', { session: false },(err, user) => {
  if(user) {
    return res.json({ result: true, user });
  }
  return res.json({mesage: "잘못된 인증정보"})
  })(req, res)
});

router.patch('/update', upload, async (req, res) => {
  const newUser = req.body;
  let new_image = '';
  if(req.file){
    console.log(req.file.filename);
    new_image = req.file.filename;
    if(req.body.old_image){
      try {
        fs.unlinkSync('./uploads/profile/' + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    }
  }else{
    new_image = req.body.old_image;
  }
  newUser.image = new_image;
  try {
    await User.findOneAndUpdate({email: newUser.email}, newUser);
    console.log(newUser);
    res.status(200).json({message: '프로필을 업데이트 하셨습니다.'})
  } catch (err) {
    res.status(404).json({message: err.message});
  }
})

module.exports = router;