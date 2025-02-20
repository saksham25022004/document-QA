const fs = require('fs');
const pdfParse = require('pdf-parse');
const path=require('path');
const Tesseract = require('tesseract.js');
const { askGemini, summarizeGemini } = require('../services/gemini');
const QuestionAnswer = require('../models/questionAnswer');
const { translateText } = require('../services/translate');
const pdfPoppler= require('pdf-poppler');

let documentText = "";

//Extracts text from images using OCR (Tesseract.js)
const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    return text;
  } 
  catch (error) {
    return "";
  }
};

// Converts PDF to images and extracts text using OCR
const extractTextFromPDFImages = async (pdfPath, outputDir) => {
  let option={
    format:'png',
    out_dir:outputDir,
    out_prefix:path.basename(pdfPath,path.extname(pdfPath)),
    page:null,
  }
  try {

    // Convert all pages to images
    await pdfPoppler.convert(pdfPath,option);

    const images = fs.readdirSync(outputDir).filter(file => file.endsWith(".png"));

    if (images.length === 0) {
      return "";
    }

    let extractedText = "";
    for (const imageFile of images) {
      const imagePath = path.join(outputDir, imageFile);
      extractedText += await extractTextFromImage(imagePath) + "\n";
    }

    // Delete images after OCR processing
    for (const imageFile of images) {
      const imagePath = path.join(outputDir, imageFile);
      fs.unlinkSync(imagePath);
    }

    return extractedText.trim();
  } 
  catch (error) {
    return "";
  }
};

//Upload and process PDF file (Extract text from both PDF and images)
exports.uploadDocument = async (req, res) => {

  const filePath = req.file.path;

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Extract text from the PDF
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdfParse(dataBuffer);
    let pdfText = parsedData.text.trim() || "";

    const outputDir="output";

    if(!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir);
    }

    // Extract text from images inside the PDF
    const imageText = await extractTextFromPDFImages(filePath, outputDir);

    // Store extracted text
    documentText = pdfText + "\n" + imageText;
    console.log(documentText);

    res.json({ message: "Document uploaded successfully"});

  } catch (err) {
    res.status(500).json({ message: `Error processing document: ${err.message}` });
  }
  finally {
    // Always delete the uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// Upload the text
exports.uploadText = async (req, res) => {
  try {
    const result = req.body;
    if (!result) return res.status(400).json({ message: 'No text uploaded' });

    documentText = result.textUpload;

    res.json({ message: 'Document uploaded successfully'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ask question and save to database
exports.askQuestion = async (req, res) => {
  try {
    const { question, language } = req.body;
    if (!documentText) return res.status(400).json({ message: 'No document uploaded yet' });

    //Call the gemini api to generate answer
    const answer = await askGemini(documentText.trim(), question);

    //return the answer in the selected language
    const translatedAnswer = await translateText(answer, language);

    // Save to MongoDB
    const newAnswer = new QuestionAnswer({ question, answer:translatedAnswer });
    await newAnswer.save();

    res.json({ answer: translatedAnswer.trim() });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all previous questions and answers
exports.getPreviousQAs = async (req, res) => {
  try {
    //return in decreasing order by date
    const qas = await QuestionAnswer.find().sort({ date: 1 });
    res.json(qas);
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Summarize document
exports.summarizeDocument = async (req, res) => {
  try {
    const { language } = req.body;
    if (!documentText) return res.status(400).json({ message: 'No document uploaded yet' });

    //return the summary of the upload text or document
    const summary = await summarizeGemini(documentText);

    //translate the summary into selected language
    const translatedSummary = await translateText(summary, language);

    res.json({ summary: translatedSummary.trim() });
  } 
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};