const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const  mongoose  = require('mongoose');
require('dotenv').config();

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));

// DB연결
mongoose.connect(process.env.DB_URI,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
})
.then(() => {
  console.log(`DB connected`);
})
.catch(err => {
  console.log(err);
});

// 미들웨어 연결
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// 라우터
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// 에러처리 미들웨어
app.use(function(req,res,next) {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});

app.use(function(err,req,res,next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {console.log(`${app.get('port')} 연결`)});