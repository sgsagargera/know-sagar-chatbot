
// Speech recognition support
const mic = document.getElementById("mic");
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  mic.onclick = () => {
    recognition.start();
    mic.disabled = true;
    mic.innerText = "🎙️ Listening...";
  };

  recognition.onresult = (e) => {
    document.getElementById("query").value = e.results[0][0].transcript;
    recognition.stop();
    mic.innerText = "🎤";
    mic.disabled = false;
  };

  recognition.onerror = () => {
    mic.innerText = "🎤";
    mic.disabled = false;
    recognition.stop();
  };
}



// Log query (mock)
function logQuery(query) {
  fetch("https://example.com/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: query, timestamp: new Date().toISOString() })
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const queryInput = document.getElementById("query");
  const responseBox = document.getElementById("response");
  const redirectBox = document.getElementById("redirect");

  const resumeAnswers = {
    "name": "I'm Sagar Gera — an SAP Hybris ninja and Java whisperer.",
    "experience": "I've worked at IBM and Cognizant as a Hybris Developer handling Sony, J&J, and Sanofi.",
    "projects": "Sony D2C Europe Rollout, Refurbished Sales, Multiwarehouse, and more.",
    "skills": "Java, Spring MVC, REST, Oracle, SAP Hybris (1811–2211), Solr, SmartEdit.",
    "tools": "IntelliJ, Git, SourceTree, Agile, DevOps.",
    "education": "B.Tech in Computer Science from GGSIPU.",
    "certifications": "SAP Commerce Cloud Developer, Industry 4.0, Electronics Jumpstart.",
    "linkedin": "Feel free to connect with me on LinkedIn: https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile"
  };

  function getSmartAnswer(input) {
    const lower = input.toLowerCase();
    for (let key in resumeAnswers) {
      if (lower.includes(key)) {
        return resumeAnswers[key];
      }
    }
    return "Hmm... I don't know that yet. Try asking about skills, experience, or projects!";
  }

  function handleAsk() {
    const query = queryInput.value.trim();
    if (!query) return;

    responseBox.innerHTML = "<em>Typing...</em>";
    setTimeout(() => {
      const answer = getSmartAnswer(query);
      
      responseBox.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'collapsible';
      btn.textContent = 'Click to Expand Answer';
      const content = document.createElement('div');
      content.className = 'content';
      content.innerHTML = `<p>${answer}</p>`;
      btn.onclick = () => {
        btn.classList.toggle('active');
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      };
      responseBox.appendChild(btn);
      responseBox.appendChild(content);
  
      redirectBox.style.display = "block";
    }, 700);
  }

  queryInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleAsk();
  });

  document.getElementById("askBtn").addEventListener("click", handleAsk);
});
