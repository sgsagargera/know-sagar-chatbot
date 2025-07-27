async function sendMessage() {
  const input = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = '';

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}