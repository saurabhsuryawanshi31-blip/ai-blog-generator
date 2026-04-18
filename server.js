const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/generate", async (req, res) => {
  console.log("🔥 Request received");

  try {
    const { title, intro, materials, steps, problems, platform } = req.body;

    let prompt = "";

    // 🛠 INSTRUCTABLES (LIKE CHATGPT STYLE)
    if (platform === "instructables") {
      prompt = `
You are a helpful student explaining a project in very simple English.

Write an Instructables-style guide.

Title: ${title}

IMPORTANT RULES:
- Use very simple English
- Keep sentences short
- Do NOT use difficult words
- Write like a human, not like an AI
- Be friendly and clear
- Explain like a school student

Format:

Introduction:
Explain what the project is and why it is useful.

Supplies:
- List materials in simple words

Step 1:
Explain clearly what to do

Step 2:
Continue step by step

(Add more steps if needed)

Problems & Solutions:
Explain common problems in simple language

Make it easy, practical, and natural.
`;
    }

    // 💻 GITHUB README
    else if (platform === "github") {
      prompt = `
Write a simple and clean GitHub README.

Project Title: ${title}

Rules:
- Use simple English
- Keep it beginner-friendly
- Avoid difficult words
- Write like a human

Format:

# ${title}

## Description
Explain the project simply

## Features
- Feature 1
- Feature 2

## Installation
Steps to install

## Usage
How to use it

## Tech Used
List technologies

## Problems Faced
Explain challenges simply
`;
    }

    // 📝 NORMAL BLOG (HUMAN STYLE)
    else {
      prompt = `
Write a simple and easy-to-read blog.

Title: ${title}

Rules:
- Use simple English
- Avoid difficult words
- Keep sentences short
- Write like a human
- Be friendly and clear

Content:

Introduction:
${intro}

Materials:
${materials}

Steps:
${steps}

Problems:
${problems}
`;
    }

    // ✅ Use your working model
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const text = result?.response?.text?.() || "⚠️ No response from AI";

    res.json({ blog: text });

  } catch (error) {
    console.error("FULL ERROR 💥:", error);
    res.status(500).json({ blog: "Error generating blog ❌" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});