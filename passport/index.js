const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {ExtractJwt, Strategy: JWTStrategy} = require('passport-jwt');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');

const passportConfig = {usernameField: 'email', passwordField: 'password', };

const passportVerify = async (email, password, done) => {
  console.log(email);
  try {
    const user = await User.findOne({email});

    if (!user) {
      done(null, false, {message: '존재하지 않는 사용자'});
      return;
    }

    const compareResult = await bcrypt.compare(password, user.password);

    if(!compareResult) {
      done(null, false, {message: '비밀번호가 올바르지 않습니다.'})
      return;
    }

    done(null, user)
    return;

  } catch (err) {
    console.error(err);
    done(err);
  };
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    const user = await User.findOne({email:jwtPayload.id});

    if(user) {
      return done(null, user);
    }

    return done(null, false, {message: '올바르지 않은 인증정보'});
  } catch (err) {
    console.error(err);
    done(err);
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};
