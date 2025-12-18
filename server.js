import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  const { gender, type, color, prompt } = req.body;

  const userInput = prompt && prompt.trim()
    ? prompt
    : `Gender: ${gender}, Type: ${type}, Color: ${color}`;

  const userMessage = `
You are a STRICT fashion-only assistant.

RULES:
1. If input is NOT related to clothing or fashion, respond ONLY with:
{"isClothing": false}

2. If it IS related, respond ONLY with:
{
  "isClothing": true,
  "design": "fashion description",
  "links": {
    "gender": "men or women",
    "type": "shirt, dress, kurta etc",
    "color": "color name"
  }
}

User input:
"${userInput}"
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }]
    });

    const raw = response.choices[0].message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.json({ isClothing: false });
    }

    const data = JSON.parse(jsonMatch[0]);
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ isClothing: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Server running on http://localhost:3000");
