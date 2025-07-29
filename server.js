
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const predefinedAnswers = {
  "skills": "I'm skilled in SQL, Power BI, Python, and SAP Hybris development.",
  "experience": "I have over 6 years of experience in data analytics and backend development.",
  "linkedin": "You can connect with me on LinkedIn: https://www.linkedin.com/in/sagar-gera-374089100",
  "technologies": "I work with Java, Spring Boot, SQL, Python, Power BI, and SAP Commerce Cloud (Hybris)."
};

app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    for (const keyword in predefinedAnswers) {
      if (lowerMessage.includes(keyword)) {
        console.log("✅ Using predefined answer for:", keyword);
        return res.json({ reply: predefinedAnswers[keyword] });
      }
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        max_tokens: 100,
        messages: [{ role: "user", content: message }]
      })
    });

    console.log("📤 OpenRouter API Status:", response.status);

    if (response.status === 402) {
      return res.json({ reply: "⚠️ Free tier limit reached. Please try a shorter query." });
    }

    const data = await response.json();
    console.log("✅ OpenRouter API Response:", data);

    const reply = data.choices?.[0]?.message?.content || "I couldn't find an answer.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /chat:", error);
    res.status(500).json({ reply: "Error processing request" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
