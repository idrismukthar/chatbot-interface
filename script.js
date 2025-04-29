import "./script.css";
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.querySelector(".chat-input");
  const sendButton = document.querySelector(".send-btn");

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    const userBubble = document.createElement("div");
    userBubble.className = "message user-message";
    userBubble.textContent = message;
    document.getElementById("chat-window").appendChild(userBubble);
    chatInput.value = "";

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message bot-message typing";
    typingIndicator.textContent = "Typing...";
    document.getElementById("chat-window").appendChild(typingIndicator);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const { reply } = await response.json();

      // Show response
      typingIndicator.textContent = reply || "Got empty response";
    } catch (error) {
      typingIndicator.textContent = "⚠️ Free AI is overloaded. Try later!";
    }
  }

  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
