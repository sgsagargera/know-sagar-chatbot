
import { apiKey } from './env.js';

const chatBox = document.getElementById("chatbox");
const input = document.getElementById("user-input");
const messages = document.getElementById("messages");
const micButton = document.getElementById("mic");

function addMessage(content, isUser = false) {
  const msg = document.createElement("div");
  msg.className = "message " + (isUser ? "user" : "bot");
  msg.innerText = content;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});

document.getElementById("send").addEventListener("click", sendMessage);

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, true);
  input.value = "";
  addMessage("Typing...", false);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You're a helpful, funny assistant answering about Sagar Gera's resume." },
                 { role: "user", content: text }]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Something went wrong!";
  document.querySelector(".bot:last-child").innerText = reply;

  const cvLink = document.createElement("a");
  cvLink.href = "cv.html";
  cvLink.target = "_blank";
  cvLink.innerText = "👉 View Sagar's Interactive CV";
  cvLink.className = "cv-link";
  messages.appendChild(cvLink);
}
