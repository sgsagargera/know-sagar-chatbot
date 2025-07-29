
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

  const suggestions = [
    "Tell me about Sagar's skills",
    "Show Sagar's work experience",
    "What technologies does Sagar know?",
    "Give me Sagar's LinkedIn",
    "What are Sagar's achievements?",
    "Does Sagar know SAP Hybris?",
    "Tell me about Sagar's career",
    "What are Sagar's data analytics skills?"
  ];

  const suggestionBox = document.createElement("div");
  suggestionBox.className = "suggestion-box";
  document.body.appendChild(suggestionBox);

  function updateBulbIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "💤" : "💡";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateBulbIcon();
  });
  updateBulbIcon();

  function createMessage(content, sender) {
    const msgContainer = document.createElement("div");
    msgContainer.className = `chat-message ${sender}-message`;

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = sender === "bot" ? "20250418_212238.jpg" : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = content;

    if (sender === "bot") {
      msgContainer.appendChild(avatar);
      msgContainer.appendChild(bubble);
    } else {
      msgContainer.appendChild(bubble);
      msgContainer.appendChild(avatar);
    }

    chatBody.appendChild(msgContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function sendMessage(customMessage = null) {
    const message = customMessage || chatInput.value.trim();
    if (!message) return;

    createMessage(message, "user");
    chatInput.value = "";
    
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    typingIndicator.style.display = "flex";
    
    suggestionBox.style.display = "none";

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      typingIndicator.style.display = "none"; typingIndicator.innerHTML = "";

      if (response.ok) {
        const data = await response.json();
        const botReply = data.reply?.trim();

        if (!botReply || botReply.length < 2) {
          const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
          createMessage(fallback, "bot");
        } else {
          createMessage(botReply, "bot");
        }
      } else {
        const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        createMessage(fallback, "bot");
      }
    } catch (error) {
      typingIndicator.style.display = "none"; typingIndicator.innerHTML = "";
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      createMessage(fallback, "bot");
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
    document.querySelectorAll(".chat-message .bubble").forEach(msg => {
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

  chatInput.addEventListener("input", () => {
    const query = chatInput.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (query.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    const matches = suggestions.filter(s => s.toLowerCase().includes(query));
    if (matches.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    matches.forEach(suggestion => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.textContent = suggestion;
      div.addEventListener("click", () => {
        chatInput.value = suggestion;
        suggestionBox.style.display = "none";
        sendMessage(suggestion);
      });
      suggestionBox.appendChild(div);
    });

    const rect = chatInput.getBoundingClientRect();
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.bottom = (window.innerHeight - rect.top + 10) + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      suggestionBox.style.display = "none";
    }
  });
});
