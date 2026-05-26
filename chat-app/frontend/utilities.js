function scrollToBottom() {
  const displayArea = document.getElementById("chat-display-area");
  if (displayArea) {
    displayArea.scrollTop = displayArea.scrollHeight;
  }
}

function createEmptyMessage() {
  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "Everyone is being quite, say something.";
  return emptyMessage;
}

function createMessageThreads(chatHistoryArray) {
  return chatHistoryArray.map(({ message, user, timestamp }) => {
    const chatThread = document.createElement("section");
    chatThread.className = "chat-thread";

    const messageElement = document.createElement("p");
    messageElement.className = "message-in-thread";
    messageElement.textContent = message;

    const timestampElement = document.createElement("p");
    timestampElement.className = "timestamp-in-thread";
    timestampElement.textContent = new Date(timestamp).toLocaleString();
    const userElement = document.createElement("p");
    userElement.className = "user-name-in-thread";
    userElement.textContent = user;

    const infoElement = document.createElement("div");
    infoElement.className = "info-in-thread";
    infoElement.append(timestampElement, userElement);

    chatThread.append(messageElement, infoElement);
    return chatThread;
  });
}

async function chatDisplay(state) {
  const chatDisplayArea = document.getElementById("chat-display-area");
  chatDisplayArea.innerHTML = "";
  const chatHistoryArray = state.messages;
  if (chatHistoryArray.length == 0) {
    chatDisplayArea.append(createEmptyMessage());
  } else {
    chatDisplayArea.append(...createMessageThreads(chatHistoryArray));
  }
  scrollToBottom();
}

function messageInputReset() {
  const formElement = document.getElementById("message-form");
  formElement.reset();
}

async function messageSubmitHandler(e) {
  e.preventDefault();

  const messageString = document.getElementById("message-input").value.trim();
  const userString = document.getElementById("user-name-input").value.trim();

  if (!messageString || !userString) {
    console.error(`Message or user cannot be empty.`);
    window.alert("Message or user cannot be empty.");
    return;
  } else {
    await postingMessage(messageString, userString);
  }
}

function messageFormHandler() {
  const formElement = document.getElementById("message-form");
  formElement.addEventListener("submit", messageSubmitHandler);
}

export {
  scrollToBottom,
  createEmptyMessage,
  createMessageThreads,
  chatDisplay,
  messageInputReset,
  messageSubmitHandler,
  messageFormHandler,
};
