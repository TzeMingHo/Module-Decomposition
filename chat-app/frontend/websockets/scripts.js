const socket = new WebSocket("ws://localhost:4001");

socket.addEventListener("open", () => {
  console.log("Connected directly to the WebSocket server!");
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event);
  displayNewMessage(message);
});

socket.addEventListener("close", () => {
  console.warn("WebSocket connection closed. Attempting reconnect logic...");
});

function sendMessage(username, text) {
  const payload = {
    user: username,
    text: text,
    timestamp: new Date().toISOString(),
  };

  socket.send(JSON.stringify(payload));
}

function displayNewMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const msgElement = document.createElement("p");
  msgElement.textContent = `[${message.user}]: ${message.text}`;
  chatBox.appendChild(msgElement);
}
