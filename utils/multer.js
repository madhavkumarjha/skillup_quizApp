import multer from "multer";

const storage = multer.memoryStorage();

// ACCEPT ALL FILE TYPES
const fileFilter = (req, file, cb) => {
  // If you want to block nothing:
  cb(null, true);

  // If later you want to validate types:
  // const allowed = [
  //   "image/png", "image/jpeg", "image/jpg",
  //   "application/pdf",
  //   "application/vnd.ms-excel",
  //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  // ];
  // if (!allowed.includes(file.mimetype)) {
  //   return cb(new Error("File type not allowed"), false);
  // }
  // cb(null, true);
};

// Universal upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  }
});

export default upload;
