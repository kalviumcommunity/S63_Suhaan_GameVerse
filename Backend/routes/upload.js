const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @route POST /upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user ? req.user._id : null,
    });

    await file.save();
    res.status(201).json({ message: 'File uploaded and saved to DB', file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'File upload failed', error: err });
  }
});

module.exports = router;
