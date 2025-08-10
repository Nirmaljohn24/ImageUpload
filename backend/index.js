const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());

// Multer storage setup
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

let maxSize = 2 * 1000 * 1000; // 2 MB

let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

let uploadHandler = upload.single('file');

app.post('/upload', (req, res) => {
    uploadHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Maximum file size is 2mb' });
            }
        } else if (err) {
            return res.status(500).json({ message: 'Upload failed' });
        }

        res.json({
            message: 'File uploaded successfully!',
            filePath: `/images/${req.file.filename}`
        });
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
