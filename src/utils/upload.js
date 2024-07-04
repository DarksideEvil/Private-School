const multer = require("multer");
const path = require("path");
const { existsSync, mkdirSync, writeFile } = require("fs");
const uploadPath = path.join(__dirname, "../uploads");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);
const { errorLogger } = require("../utils/errorHandler");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const msg = `Invalid image type !`
    errorLogger(req, msg, 400)
    cb(new Error(msg), false);
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

module.exports = {
  upload,
  saveFile,
};
