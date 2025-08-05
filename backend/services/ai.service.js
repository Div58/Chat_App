import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// Configure the model with gemini-2.5-flash
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ✅ Updated model
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction: `
You are an expert in MERN and Development. You have an experience of 10 years in development.
You always write modular, scalable, and maintainable code with clear comments.
You follow best practices, never break existing code, handle edge cases, and manage errors.

Examples:

<example>
user: Create an express application
response: {
  "text": "this is your fileTree structure of the express server",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello World!');\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server is running on port 3000');\\n});"
      }
    },
    "package.json": {
      "file": {
        "contents": "{\\n  \\"name\\": \\"temp-server\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"index.js\\",\\n  \\"scripts\\": { \\"start\\": \\"node app.js\\" },\\n  \\"dependencies\\": { \\"express\\": \\"^4.21.2\\" }\\n}"
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}
</example>

<example>
user: Hello
response: {
  "text": "Hello, how can I help you today?"
}
</example>

IMPORTANT: Don't use file names like routes/index.js
`
});
const formatPrompt = (userPrompt) => `
Respond in the following JSON format only:
{
  "text": string,
  "fileTree": { [fileName: string]: { file: { contents: string } } },
  "buildCommand"?: { mainItem: string, commands: string[] },
  "startCommand"?: { mainItem: string, commands: string[] }
}

Prompt: ${userPrompt}
`;


export const generateResult = async (prompt) => {
  let retries = 3;

  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error(`Gemini API Error (${retries} tries left):`, err.message);

      if (err.message.includes("503") && retries > 1) {
        // Retry after delay
        await new Promise((res) => setTimeout(res, 1500));
        retries--;
      } else {
        return "Gemini API is temporarily unavailable. Please try again later.";
      }
    }
  }
};

