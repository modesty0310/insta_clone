const multer = require('multer');

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/profile');
  },
  filename : function(req, file, cb){
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
  },
})

exports.upload = multer({
  storage:storage
}).single('image');