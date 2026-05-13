const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-subtasks', authenticateToken, async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Task title is required' });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing from .env");
            return res.status(500).json({ message: 'AI configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `Generate exactly 3 short sub-tasks for the following task: "${title}". Return the result as a raw JSON array of strings only. Example: ["subtask1", "subtask2", "subtask3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the text (sometimes Gemini adds markdown code blocks)
        const jsonMatch = text.match(/\[.*\]/s);
        const subtasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        res.json(subtasks);
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: 'Failed to generate subtasks' });
    }
});

module.exports = router;
