import multer from 'multer';//multer is a nodejs middleware that helps your server  handle and save file uploads from forms

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage });

export default upload;
