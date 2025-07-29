
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.post("/chat", async (req, res) => {
  console.log("📩 Incoming /chat request:", req.body);

  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }]
      })
    });

    console.log("📤 OpenRouter API status:", response.status);

    const data = await response.json();
    console.log("✅ OpenRouter API response:", data);

    const reply = data.choices?.[0]?.message?.content || "I couldn't find an answer.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /chat:", error);
    res.status(500).json({ reply: "Error processing request" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
