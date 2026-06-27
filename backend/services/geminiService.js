const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const { fetch, Headers, Request, Response } = require('undici');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
}

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function generateCourse(topic) {
    const prompt = `You are an expert course creator. Generate a comprehensive course on the topic: "${topic}".
Return ONLY a valid JSON object with the following structure (no markdown, no backticks, raw JSON only):
{
    "title": "Course title",
    "description": "Course description",
    "tags": ["tag1", "tag2"],
    "modules": [
        {
            "title": "Module title",
            "lessons": ["Lesson 1", "Lesson 2"]
        }
    ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const courseData = JSON.parse(text);
    return courseData;
}

module.exports = {generateCourse};
