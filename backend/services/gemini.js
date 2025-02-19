const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

const GEMINI_API_KEY = "AIzaSyBO1XXS68R7HrRLOvQKwePDJBU7MePyJeU";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to ask Gemini AI a question based on the document content
async function askGemini(documentText, question) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    //prompt for generate answer for the document and question
    const prompt = `Read this content carefully: ${documentText}.
    Now answer the following question based on the above passage: ${question}`;

    //call the gemini model to get answer
    const generatedContent = await model.generateContent([prompt]);

    const responseText = generatedContent.response.text().trim();
    return responseText;
  } catch (error) {
    throw new Error("Failed to fetch response from Gemini.");
  }
}

// Function to summarize the document content using Gemini AI
async function summarizeGemini(documentText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    //prompt for getting the summary of the given document
    const prompt = `Summarize the following text in a concise manner: ${documentText}`;

    //call the model to get answer
    const generatedContent = await model.generateContent([prompt]);

    const responseText = generatedContent.response.text().trim();
    return responseText;
  } catch (error) {
    throw new Error("Failed to generate summary.");
  }
}

module.exports = { askGemini, summarizeGemini };
