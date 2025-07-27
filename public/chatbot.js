
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("chat-form");
  const questionInput = document.getElementById("question");
  const messagesContainer = document.querySelector(".messages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = question;
    messagesContainer.appendChild(userMsg);

    questionInput.value = "";

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = data.answer || data.error || "No response from bot.";
      messagesContainer.appendChild(botMsg);
    } catch (error) {
      const errorMsg = document.createElement("div");
      errorMsg.className = "message bot";
      errorMsg.textContent = "Error talking to bot.";
      messagesContainer.appendChild(errorMsg);
    }
  });
});
