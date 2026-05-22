export function scrollToBottom() {
  const displayArea = document.getElementById("chat-display-area");
  if (displayArea) {
    displayArea.scrollTop = displayArea.scrollHeight;
  }
}
