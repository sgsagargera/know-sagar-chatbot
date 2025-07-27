async function sendMessage() {
  const input = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = '';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace manually or securely through backend
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.choices[0].message.content}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}