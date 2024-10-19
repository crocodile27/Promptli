const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Use CORS to allow requests from your front-end
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await model.generateContent(prompt);
    res.json({ generatedText: result.response.text() });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send("Error generating text");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
