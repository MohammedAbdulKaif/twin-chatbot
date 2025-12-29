let sessionId = null;

const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typing");
const micBtn = document.getElementById("micBtn");

/* ENTER */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

/* SPEECH */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  micBtn.onclick = () => {
    micBtn.classList.add("listening");
    recognition.start();
  };

  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    micBtn.classList.remove("listening");
    sendMessage();
  };

  recognition.onend = () => micBtn.classList.remove("listening");
}

/* SEND */
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";
  typing.style.display = "block";

  const res = await fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, session_id: sessionId })
  });

  const data = await res.json();
  sessionId = data.session_id;

  typing.style.display = "none";
  addMessage(data.reply, "bot");
}

/* ADD MESSAGE */
function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `message ${cls}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* SCROLL ANIMATION */
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("show"));
});
sections.forEach(s => observer.observe(s));
