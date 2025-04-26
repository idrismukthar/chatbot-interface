document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.querySelector(".chat-input");
  const sendButton = document.querySelector(".send-btn");
  const chatWindow = document.getElementById("chat-window");
  const botHead = document.querySelector(".chat-logo");
  const botIntroText = document.querySelector(".bot-intro-text");

  async function sendMessage() {
    let userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    // Hide bot head and intro text on first message
    if (botHead) botHead.style.display = "none";
    if (botIntroText) botIntroText.style.display = "none";

    // ===== USER MESSAGE (RIGHT SIDE) =====
    const userBubble = document.createElement("div");
    userBubble.classList.add("message", "user-message");
    userBubble.textContent = userMessage;
    chatWindow.appendChild(userBubble);

    chatInput.value = ""; // Clear input

    // ===== SHOW "TYPING..." (LEFT SIDE) =====
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot-message", "typing");
    typingIndicator.textContent = "Typing...";
    chatWindow.appendChild(typingIndicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
      // ===== SEND TO BACKEND =====
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const { reply } = await response.json();

      // ===== REMOVE "TYPING..." & SHOW BOT REPLY (LEFT SIDE) =====
      chatWindow.removeChild(typingIndicator);

      const botBubble = document.createElement("div");
      botBubble.classList.add("message", "bot-message");
      botBubble.textContent = reply;
      chatWindow.appendChild(botBubble);
    } catch (error) {
      console.error("Error:", error);
      chatWindow.removeChild(typingIndicator); // Remove typing on error

      const errorBubble = document.createElement("div");
      errorBubble.classList.add("message", "bot-message");
      errorBubble.textContent = "⚠️ AI service error. Try again.";
      chatWindow.appendChild(errorBubble);
    }

    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
  }

  // Event Listeners
  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
