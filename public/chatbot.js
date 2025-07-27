document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const chatBody = document.getElementById('chat-body');
  const sendBtn = document.getElementById('send-btn');
  const input = document.getElementById('chat-input');
  const typing = document.getElementById('typing-indicator');
  const exportBtn = document.getElementById('export-btn');
  const clearBtn = document.getElementById('clear-btn');

  // Dark mode
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Chat
  function appendMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', role);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.style.backgroundImage = role === 'user'
      ? 'url(https://cdn-icons-png.flaticon.com/512/149/149071.png)' // user avatar
      : 'url(https://cdn-icons-png.flaticon.com/512/4712/4712106.png)'; // bot avatar

    const message = document.createElement('div');
    message.classList.add('text');
    message.textContent = text;

    bubble.appendChild(role === 'user' ? message : avatar);
    bubble.appendChild(role === 'user' ? avatar : message);

    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  sendBtn.addEventListener('click', async () => {
    const question = input.value.trim();
    if (!question) return;

    appendMessage('user', question);
    input.value = '';
    typing.style.display = 'block';

    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      setTimeout(() => {
        typing.style.display = 'none';
        appendMessage('bot', data.answer || 'Sorry, I could not get a response.');
      }, 800); // Typing delay
    } catch (e) {
      typing.style.display = 'none';
      appendMessage('bot', '❌ Error talking to bot.');
    }
  });

  // Export
  exportBtn.addEventListener('click', () => {
    const messages = [...chatBody.querySelectorAll('.text')].map((el) => el.textContent);
    const blob = new Blob([messages.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'chat-log.txt';
    anchor.click();
  });

  // Clear
  clearBtn.addEventListener('click', () => {
    chatBody.innerHTML = '';
  });
});
