
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-btn");
  const chatBody = document.getElementById("chat-body");
  const typingIndicator = document.getElementById("typing-indicator");

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      const userMsg = document.createElement("div");
      userMsg.className = "message user-message";
      userMsg.textContent = message;
      chatBody.appendChild(userMsg);
      chatInput.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;

      typingIndicator.style.display = "block";
      setTimeout(() => {
        typingIndicator.style.display = "none";
        const botMsg = document.createElement("div");
        botMsg.className = "message bot-message";
        botMsg.textContent = "This is a response from the bot.";
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    }
  }

  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Bulb toggle
  const themeToggle = document.getElementById("themeToggle");
  function updateBulbIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "💤" : "💡";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateBulbIcon();
  });
  updateBulbIcon();
});
