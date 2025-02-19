const translate = require('google-translate-api-x');

// Function to translate text
async function translateText(text, targetLanguage) {
  if (!targetLanguage || targetLanguage === 'en') return text; // Return original if English
  
  try {
    //translate the given text into selected language
    const res = await translate(text, { to: targetLanguage });
    return res.text;
  } catch (error) {
    console.error("Translation error:", error.message);
    return text; // Fallback to original text
  }
}

module.exports = { translateText };
