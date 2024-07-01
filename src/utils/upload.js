const multer = require("multer");
const path = require("path");
const { existsSync, mkdirSync, writeFile } = require("fs");
const uploadPath = path.join(__dirname, "../uploads");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error(`Invalid image type !`), false);
  }
  cb(null, true);
};

async function saveFile(req, res) {
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  if (req?.file) {
    const extension = path.extname(req.file?.originalname);
    const filename = Date.now() + extension;
    const filePath = path.join(uploadPath, filename);

    writeFileAsync(filePath, req.file?.buffer);
    const url = `${req.protocol}://${req.get("host")}/${filename}`;
    req.body.img = url;
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { files: 1, fileSize: 1024 * 1024 * 5 }, // 5MB
}).single("img");

// function handleMulterError(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     console.error("Multer error:", err.code);
//     if (err.code === "LIMIT_UNEXPECTED_FILE") {
//       return res.status(400).json({ msg: "Please upload only one file!" });
//     } else if (err.code === "LIMIT_FILE_COUNT") {
//       return res.status(400).json({ msg: "Too many files uploaded!" });
//     } else if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ msg: "File size is too large!" });
//     }
//     return res.status(400).json({ msg: `Multer error: ${err.code}` });
//   } else if (err) {
//     console.error("General error:", err);
//     return res.status(400).json({ msg: err.message });
//   }

//   next();
// }

module.exports = {
  upload,
  saveFile,
  // handleMulterError,
};
