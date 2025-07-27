document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const messages = document.querySelector(".messages");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const question = input.value.trim();

    if (!question) return;

    // Show user's question
    const userDiv = document.createElement("div");
    userDiv.textContent = question;
    userDiv.classList.add("user-message");
    messages.appendChild(userDiv);

    input.value = "";

    // Call backend
    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question }) // ✅ Correct key
      });

      const data = await response.json();

      const botDiv = document.createElement("div");
      botDiv.textContent = data.answer || "No response";
      botDiv.classList.add("bot-message");
      messages.appendChild(botDiv);
    } catch (err) {
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "Error talking to bot.";
      errorDiv.classList.add("bot-message");
      messages.appendChild(errorDiv);
    }
  });
});
