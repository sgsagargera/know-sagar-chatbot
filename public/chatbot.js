
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");
  const typingIndicator = document.getElementById("typing-indicator");

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle && localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }

  const sendButton = document.getElementById("send-btn");
  const clearBtn = document.getElementById("clear-btn");
  const exportBtn = document.getElementById("export-btn");

  const botAvatar = "20250418_212238.jpg";
  const userAvatar = "https://www.svgrepo.com/show/384674/user-chat.svg";

  const appendMessage = (text, sender = "bot") => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.backgroundImage = `url(${sender === "user" ? userAvatar : botAvatar})`;

    const message = document.createElement("div");
    message.className = "text";
    message.textContent = text;

    bubble.appendChild(avatar);
    bubble.appendChild(message);
    chatBody.appendChild(bubble);
    bubble.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    const question = chatInput.value.trim();
    if (!question) return;

    appendMessage(question, "user");
    chatInput.value = "";
    typingIndicator.style.display = "block";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      typingIndicator.style.display = "none";

      await new Promise(resolve => setTimeout(resolve, 500));
      appendMessage(data.answer || "Sorry, I couldn't fetch a response.", "bot");

    } catch {
      typingIndicator.style.display = "none";
      appendMessage("❌ Error talking to bot.", "bot");
    }
  };

  sendButton?.addEventListener("click", sendMessage);
  chatInput?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  clearBtn?.addEventListener("click", () => chatBody.innerHTML = "");

  exportBtn?.addEventListener("click", () => {
    const logs = [...chatBody.querySelectorAll(".chat-bubble")]
      .map(el => el.querySelector(".text")?.textContent || "")
      .join("\n\n");
    const blob = new Blob([logs], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chat_log.txt";
    a.click();
  });
});
