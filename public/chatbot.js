document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("chat-form");
  const questionInput = document.getElementById("question");
  const messages = document.getElementById("messages");
  const typingIndicator = document.getElementById("typing-indicator");
  const themeToggle = document.getElementById("themeToggle");

  // Restore theme from localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  // Toggle dark mode
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    // User chat bubble
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = question;
    messages.appendChild(userBubble);

    scrollToBottom();
    questionInput.value = "";

    // Show typing indicator
    typingIndicator.style.display = "block";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      typingIndicator.style.display = "none";

      const botBubble = document.createElement("div");
      botBubble.className = "chat-bubble bot";
      botBubble.textContent = data.answer || data.error || "No response from bot.";
      messages.appendChild(botBubble);

      scrollToBottom();
    } catch (error) {
      typingIndicator.style.display = "none";

      const errorBubble = document.createElement("div");
      errorBubble.className = "chat-bubble error";
      errorBubble.textContent = "❌ Error talking to bot.";
      messages.appendChild(errorBubble);

      scrollToBottom();
    }
  });

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }
});
