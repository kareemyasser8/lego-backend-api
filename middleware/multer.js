const multer = require('multer')
const path = require('path')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type")
        if (isValid) {
            error = null
        }
        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const originalFilename = path.parse(file.originalname).name;
        const uniqueFileName = `${originalFilename}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

module.exports =  multer({storage: storage});