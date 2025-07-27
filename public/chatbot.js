function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  appendMessage("You", message);

  // Replace this with your own logic (mock response)
  let reply = getBotResponse(message);
  setTimeout(() => appendMessage("SagarBot", reply), 500);

  input.value = "";
}

function appendMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function getBotResponse(input) {
  input = input.toLowerCase();
  if (input.includes("sagar")) return "Sagar is a software developer with expertise in Java, SQL, and SAP Hybris.";
  if (input.includes("skills")) return "Sagar is skilled in SQL, Python, Power BI, and data analysis.";
  if (input.includes("experience")) return "Sagar has 6 years of experience including work at EY as a Data Analyst.";
  return "I'm still learning about that! Ask me something else about Sagar.";
}
