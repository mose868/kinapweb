const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const FileUpload = require('../models/FileUpload');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/avi', 'video/mov',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Upload single file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { uploadedBy, uploadContext, relatedId } = req.body;
    
    if (!uploadedBy) {
      return res.status(400).json({ message: 'Uploader information is required' });
    }

    // Create file record in MongoDB
    const fileUpload = new FileUpload({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).substring(1),
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileSizeFormatted: formatFileSize(req.file.size),
      storagePath: req.file.path,
      downloadUrl: `/api/files/download/${req.file.filename}`,
      uploadedBy: uploadedBy,
      uploadContext: uploadContext || 'general',
      relatedId: relatedId,
      status: 'completed'
    });

    await fileUpload.save();

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: fileUpload._id,
        fileName: fileUpload.fileName,
        originalName: fileUpload.originalName,
        fileType: fileUpload.fileType,
        fileSize: fileUpload.fileSizeFormatted,
        downloadUrl: fileUpload.downloadUrl,
        mimeType: fileUpload.mimeType
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { uploadedBy, uploadContext, relatedId } = req.body;
    
    if (!uploadedBy) {
      return res.status(400).json({ message: 'Uploader information is required' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileUpload = new FileUpload({
        fileName: file.filename,
        originalName: file.originalname,
        fileType: path.extname(file.originalname).substring(1),
        mimeType: file.mimetype,
        fileSize: file.size,
        fileSizeFormatted: formatFileSize(file.size),
        storagePath: file.path,
        downloadUrl: `/api/files/download/${file.filename}`,
        uploadedBy: uploadedBy,
        uploadContext: uploadContext || 'general',
        relatedId: relatedId,
        status: 'completed'
      });

      await fileUpload.save();
      uploadedFiles.push({
        id: fileUpload._id,
        fileName: fileUpload.fileName,
        originalName: fileUpload.originalName,
        fileType: fileUpload.fileType,
        fileSize: fileUpload.fileSizeFormatted,
        downloadUrl: fileUpload.downloadUrl,
        mimeType: fileUpload.mimeType
      });
    }

    res.json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Download file
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'File download failed' });
  }
});

// Get file info
router.get('/info/:fileId', async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ file });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ message: 'Failed to get file info' });
  }
});

// Delete file
router.delete('/delete/:fileId', async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.storagePath)) {
      fs.unlinkSync(file.storagePath);
    }

    // Delete from database
    await FileUpload.findByIdAndDelete(req.params.fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'File deletion failed' });
  }
});

// Get user's uploaded files
router.get('/user/:userId', async (req, res) => {
  try {
    const { uploadContext, limit = 50, offset = 0 } = req.query;
    
    const query = { uploadedBy: req.params.userId };
    if (uploadContext) {
      query.uploadContext = uploadContext;
    }

    const files = await FileUpload.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await FileUpload.countDocuments(query);

    res.json({
      files,
      total,
      hasMore: total > parseInt(offset) + files.length
    });
  } catch (error) {
    console.error('Get user files error:', error);
    res.status(500).json({ message: 'Failed to get user files' });
  }
});

module.exports = router; 