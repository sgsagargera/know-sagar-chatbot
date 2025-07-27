document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("chat-button");
  const closeBtn = document.getElementById("close-popup");
  const popup = document.getElementById("chat-popup");
  const form = document.getElementById("chat-form");
  const messages = document.getElementById("messages");
  const questionInput = document.getElementById("question");
  const typing = document.getElementById("typing-indicator");
  const clearBtn = document.getElementById("clear-chat");
  const exportBtn = document.getElementById("export-chat");

  openBtn.addEventListener("click", () => popup.style.display = "flex");
  closeBtn.addEventListener("click", () => popup.style.display = "none");

  const delayTyping = (text, container) => {
    typing.style.display = "block";
    setTimeout(() => {
      typing.style.display = "none";
      const botMsg = document.createElement("div");
      botMsg.className = "chat-bubble bot";
      botMsg.textContent = text;
      container.appendChild(botMsg);
      botMsg.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;

    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble user";
    userMsg.textContent = question;
    messages.appendChild(userMsg);
    userMsg.scrollIntoView({ behavior: "smooth" });

    questionInput.value = "";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      delayTyping(data.answer || "Sorry, I couldn’t understand that.", messages);
    } catch (err) {
      delayTyping("❌ Error talking to bot.", messages);
    }
  });

  clearBtn.addEventListener("click", () => {
    messages.innerHTML = "";
  });

  exportBtn.addEventListener("click", () => {
    const logs = Array.from(messages.querySelectorAll(".chat-bubble"))
      .map(el => (el.classList.contains("user") ? "You: " : "SagarBot: ") + el.textContent)
      .join("\n");
    
    const blob = new Blob([logs], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sagar-chat-history.txt";
    a.click();
  });
});
