const express = require('express');
const multer = require('multer');
const { uploadDocument, uploadText, askQuestion, getPreviousQAs, summarizeDocument } = require('../controllers/documentController');

const router = express.Router();

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('document'), uploadDocument);// route for upload the file based document
router.post('/upload-text', uploadText);// route for upload the mannually written text
router.post('/ask', askQuestion);// route for getting answer of the given question
router.get('/previous', getPreviousQAs);// route for get all previous question-answer
router.post('/summarize', summarizeDocument);// route for get the summary of the given text/document

module.exports = router;
