
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("chat-toggle");
  const popup = document.getElementById("chat-popup");
  const closeBtn = document.getElementById("close-chat");
  const form = document.getElementById("chat-form");
  const questionInput = document.getElementById("question");
  const messages = document.getElementById("messages");
  const typingIndicator = document.getElementById("typing-indicator");
  const clearBtn = document.getElementById("clear-chat");
  const exportBtn = document.getElementById("export-chat");

  toggleBtn.addEventListener("click", () => popup.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;

    appendBubble(question, 'user');
    questionInput.value = '';

    typingIndicator.style.display = 'block';

    // Simulate typing delay
    await new Promise(res => setTimeout(res, 1000));

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      typingIndicator.style.display = 'none';
      appendBubble(data.answer || 'No response from bot.', 'bot');
    } catch (error) {
      typingIndicator.style.display = 'none';
      appendBubble("❌ Error talking to bot.", 'bot');
    }
  });

  function appendBubble(text, sender) {
    const div = document.createElement("div");
    div.className = `chat-bubble ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    div.scrollIntoView({ behavior: "smooth" });
  }

  clearBtn.addEventListener("click", () => messages.innerHTML = '');

  exportBtn.addEventListener("click", () => {
    const logs = Array.from(messages.children)
      .map(el => `${el.classList.contains("user") ? "You" : "Bot"}: ${el.textContent}`)
      .join('\n');
    const blob = new Blob([logs], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat_log.txt";
    link.click();
  });
});
