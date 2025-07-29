
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-btn");
  const chatBody = document.getElementById("chat-body");
  const typingIndicator = document.getElementById("typing-indicator");
  const themeToggle = document.getElementById("themeToggle");
  const suggestionsContainer = document.querySelector(".quick-suggestions");

  const fallbackResponses = [
    "🤔 Hmm… that's outside my expertise. Try asking about Sagar’s professional skills.",
    "😅 I’d love to answer that, but I’m designed to talk about Sagar’s career and experience.",
    "😂 That’s a fun one, but let's stick to Sagar’s professional journey!",
    "👨‍💻 I specialize in answering questions about Sagar’s work and expertise. Try asking something related!"
  ];

  const suggestionPool = [
    "Tell me about Sagar's skills",
    "Show Sagar's work experience",
    "What technologies does Sagar know?",
    "Give me Sagar's LinkedIn",
    "What are Sagar's achievements?",
    "Does Sagar know SAP Hybris?",
    "Tell me about Sagar's career",
    "What are Sagar's data analytics skills?"
  ];

  function loadSuggestions() {
    suggestionsContainer.innerHTML = "";
    const shuffled = suggestionPool.sort(() => 0.5 - Math.random());
    shuffled.slice(0, 4).forEach(suggestion => {
      const btn = document.createElement("button");
      btn.className = "suggestion-btn";
      btn.textContent = suggestion;
      btn.addEventListener("click", () => sendMessage(suggestion));
      suggestionsContainer.appendChild(btn);
    });
  }

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

    // Refresh suggestions after each message
    loadSuggestions();
  }

  sendButton.addEventListener("click", () => sendMessage());
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initial load of suggestions
  loadSuggestions();
});
