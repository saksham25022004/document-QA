const fs = require('fs');
const pdfParse = require('pdf-parse');
const { askGemini, summarizeGemini } = require('../services/gemini');
const QuestionAnswer = require('../models/questionAnswer');
const { translateText } = require('../services/translate');

// Store document text
let documentText = "";

// Upload and parse document
exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    //convert the file data into text
    const dataBuffer = fs.readFileSync(file.path);
    const parsedData = await pdfParse(dataBuffer);
    documentText = parsedData.text;

    //if the data is stored succcessfully it will delete the file
    fs.unlinkSync(file.path);

    res.json({ message: 'Document uploaded successfully'});
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const answer = await askGemini(documentText, question);

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