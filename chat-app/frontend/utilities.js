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

function createMessageThreads(chatHistoryArray, socketInstance) {
  return chatHistoryArray.map(({ id, message, user, timestamp, like=0, dislike=0 }) => {
    const chatThread = document.createElement("section");
    chatThread.className = "chat-thread";

    const messageElement = document.createElement("p");
    messageElement.className = "message-in-thread";
    messageElement.textContent = message;

    const reactionsContainer = document.createElement("div");
    reactionsContainer.className = "reactions-container";

    const likeButton = document.createElement("button");
    likeButton.className = "reaction-btn like-btn";
    likeButton.textContent = `👍 ${like}`;
    likeButton.addEventListener("click", () => {
      socketInstance.send(JSON.stringify({
        type: "REACTION",
        data: {messageId: id, action: "like"}  
      }))
    })

    const dislikeButton = document.createElement("button");
    dislikeButton.className = "reaction-btn dislike-btn";
    dislikeButton.textContent = `👎 ${dislike}`;
    dislikeButton.addEventListener("click", () => {
      socketInstance.send(JSON.stringify({
        type: "REACTION",
        data: {messageId: id, action: "dislike"}  
      }))
    })

    reactionsContainer.append(likeButton, dislikeButton);

    const timestampElement = document.createElement("p");
    timestampElement.className = "timestamp-in-thread";
    timestampElement.textContent = new Date(timestamp).toLocaleString();
    const userElement = document.createElement("p");
    userElement.className = "user-name-in-thread";
    userElement.textContent = user;

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-in-thread";
    infoContainer.append(timestampElement, userElement);

    chatThread.append(messageElement, reactionsContainer, infoContainer);
    return chatThread;
  });
}

async function chatDisplay(state, socketInstance) {
  const chatDisplayArea = document.getElementById("chat-display-area");
  chatDisplayArea.innerHTML = "";
  const chatHistoryArray = state.messages;
  if (chatHistoryArray.length == 0) {
    chatDisplayArea.append(createEmptyMessage());
  } else {
    chatDisplayArea.append(...createMessageThreads(chatHistoryArray, socketInstance));
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
