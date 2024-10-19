// server.js
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();  // Load environment variables

const app = express();
const PORT = 3000;

// Use CORS to allow requests from your front-end
app.use(cors());
app.use(express.json());

// Initialize GoogleGenerativeAI with API key from .env
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("API Key is missing. Make sure you have a .env file with GOOGLE_API_KEY.");
  process.exit(1); // Stop server if API key is not provided
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", 
  generationConfig: {
  responseMimeType: "application/json",
},});





app.post("/generate", async (req, res) => {
  const { promptText } = req.body;
  console.log(req.body)
  if (!promptText) {
    return res.status(400).json({ error: "promptText is required" });
  }

  // New detailed prompt
  const prompt = `prompt = """Please analyze the following AI prompt: Prompt: ${promptText}
and provide suggestions for improvement across multiple dimensions and only return a .json file with 3 different objects of this format starting with “{“ and ending with “}” that each contain an improved prompt and a summary of the prompt in less than 15 words that highlights the difference in the prompts. The summary does not need to be grammatically correct.

Specifically, please address the following dimensions in your analysis:

1. Clarity and Specificity: 
- Identify any ambiguities, vague terms, or areas that could benefit from more detail or context.
- Suggest ways to make the prompt clearer, more specific, and easier for an AI to understand and respond to effectively.

2. Structure and Organization:
- Assess the logical flow and organization of the prompt. 
- Recommend ways to restructure the prompt for better coherence and effectiveness, such as using a problem-solution format, step-by-step instructions, or a series of focused questions.

3. Language and Tone:
- Evaluate the language used in the prompt and suggest improvements in word choice, vocabulary precision, and overall readability.

4. Focus and Scope:
- Determine whether the prompt is appropriately focused and scoped for its intended purpose.
- Suggest ways to narrow or expand the focus as needed, and recommend any additional constraints or guidelines that could help elicit more targeted and relevant responses.

5. AI Optimization:
- Provide recommendations for making the prompt more 'AI-friendly', considering factors such as leveraging the AI's strengths, avoiding common pitfalls, and encouraging creative and diverse responses.
- Suggest any AI-specific optimizations or best practices that could enhance the prompt's effectiveness.

Use this JSON schema:

Prompts = {‘prompt’: str, ‘summary’: str}
Return: list[Prompt]"""
`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();  // Await to get the response text
    rawText = generatedText.trim();  // Remove any leading/trailing whitespace
    rawText = rawText.replace(/^"|"$/g, ''); // Remove any surrounding double quotes if present
    console.log(rawText)
    // Attempt to parse the cleaned text into JSON
    // const jsonResponse = JSON.parse(rawText); 
    
    // If the result is already a JSON format (as expected), parse it
    // const jsonResponse = JSON.parse(generatedText);

    res.json(rawText);  // Return the JSON response
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: "Error generating text" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
