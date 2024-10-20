const manifest = chrome.runtime.getManifest();
const apiKey = manifest.api_key;

const genAI = new GoogleGenerativeAI(apiKey);

if (apiKey) { // Generate the background.js script with the API key injected 
    const backgroundScript = chrome.runtime.onInstalled.addListener(() => { chrome.storage.local.set({ apiKey: '${apiKey}' }); }); ;
    // Save it to background.js 
    fs.writeFileSync('./background.js', backgroundScript); 
    console.log('Background script generated with API key.'); } 
    else 
        { console.error('API_KEY not found in .env file.'); }

// Access the API Key in Your Code
chrome.storage.local.get("apiKey", (result) => {
    const apiKey = result.apiKey;
    if (apiKey) {
      initializeGenerativeAI(apiKey);
    } else {
      console.error("API key not found in chrome.storage");
    }
  });

  async function initializeGenerativeAI(apiKey) {
    const genAI = genAI
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    Please analyze the following AI prompt: 

    Prompt: "Can you help me fix my code? 'Hello World'"

    and provide suggestions for improvement across multiple dimensions. Only return a JSON file with 3 different objects, each formatted as {"prompt": string, "summary": string}. Each object must contain an improved prompt and a summary of the prompt in less than 15 words, highlighting the difference between the original and improved prompts. The summary does not need to be grammatically perfect.

    Specifically, please address the following dimensions in your analysis:

    1. **Clarity and Specificity**:
    - Identify any ambiguities, vague terms, or areas that could benefit from more detail or context.
    - Suggest ways to make the prompt clearer, more specific, and easier for the AI to understand and respond to effectively.

    2. **Structure and Organization**:
    - Assess the logical flow and organization of the prompt.
    - Recommend ways to restructure the prompt for better coherence and effectiveness, such as using a problem-solution format, step-by-step instructions, or a series of focused questions.

    3. **Language and Tone**:
    - Evaluate the language used in the prompt and suggest improvements in word choice, vocabulary precision, and overall readability.

    4. **Focus and Scope**:
    - Determine whether the prompt is appropriately focused and scoped for its intended purpose.
    - Suggest ways to narrow or expand the focus as needed, and recommend any additional constraints or guidelines that could help elicit more targeted and relevant responses.

    5. **AI Optimization**:
    - Provide recommendations for making the prompt more 'AI-friendly', considering factors such as leveraging the AI's strengths, avoiding common pitfalls, and encouraging creative and diverse responses.
    - Suggest any AI-specific optimizations or best practices that could enhance the prompt's effectiveness.

    Use this JSON schema:
    {
    "prompt": string,
    "summary": string
    }
    Return: Array<Prompt>
    `;

    try {
      const result = await model.generateContent(prompt);
      console.log(result.response.text());
    } catch (error) {
      console.error('Error generating content:', error);
    }
  }
  
// Listen for messages from context.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request to call Gemini API", request);
  
    if (request.action === "callGeminiAPI") {
      console.log("Processing Gemini API call");
  
      // Replace this with your actual API key retrieval logic
      const apiKey = request.apiKey;
  
      if (apiKey) {
        // Initialize GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(apiKey);
  
        // Define the model
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
  
        // Define the prompt
        const prompt = `
          Please analyze the following AI prompt: 
          
          Prompt: "Can you help me fix my code? 'Hello World'"
          
          and provide suggestions for improvement across multiple dimensions. Only return a JSON file with 3 different objects, 
          each formatted as {"prompt": string, "summary": string}. Each object must contain an improved prompt and a summary 
          of the prompt in less than 15 words, highlighting the difference between the original and improved prompts. 
          The summary does not need to be grammatically perfect.
        `;
  
        // Call the API and handle response
        model.generateContent(prompt)
          .then(async (result) => {
            const text = await result.response.text();  // Await the result of .text()
            console.log("Gemini API response:", text);
            sendResponse({ success: true, data: text });
          })
          .catch((error) => {
            console.error("Error generating content:", error);
            sendResponse({ success: false, error });
          });
        
        // Indicate that the response will be sent asynchronously
        return true;
      } else {
        console.error("API key not provided");
        sendResponse({ success: false, error: "API key not provided" });
      }
    }
  });
  