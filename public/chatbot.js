
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-btn");
  const chatBody = document.getElementById("chat-body");
  const typingIndicator = document.getElementById("typing-indicator");
  const themeToggle = document.getElementById("themeToggle");
  const exportBtn = document.getElementById("export-btn");
  const clearBtn = document.getElementById("clear-btn");

  const fallbackResponses = [
    "🤔 Hmm… that's outside my expertise. Try asking about Sagar’s professional skills.",
    "😅 I’d love to answer that, but I’m designed to talk about Sagar’s career and experience.",
    "😂 That’s a fun one, but let's stick to Sagar’s professional journey!",
    "👨‍💻 I specialize in answering questions about Sagar’s work and expertise. Try asking something related!"
  ];

  function updateBulbIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "💤" : "💡";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateBulbIcon();
  });
  updateBulbIcon();

  function addMessage(content, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = `message ${sender}-message`;
    msg.textContent = content;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function sendMessage(customMessage = null) {
    const message = customMessage || chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";
    typingIndicator.style.display = "block";

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      typingIndicator.style.display = "none";

      if (response.ok) {
        const data = await response.json();
        const botReply = data.reply?.trim();

        if (!botReply || botReply.length < 2) {
          const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
          addMessage(fallback);
        } else {
          addMessage(botReply);
        }
      } else {
        const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        addMessage(fallback);
      }
    } catch (error) {
      typingIndicator.style.display = "none";
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(fallback);
      console.error("Chat API error:", error);
    }
  }

  sendButton.addEventListener("click", () => sendMessage());
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  exportBtn.addEventListener("click", () => {
    let chatText = "";
    document.querySelectorAll(".message").forEach(msg => {
      chatText += msg.textContent + "\n";
    });
    const blob = new Blob([chatText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat_history.txt";
    link.click();
  });

  clearBtn.addEventListener("click", () => {
    chatBody.innerHTML = "";
  });
});
