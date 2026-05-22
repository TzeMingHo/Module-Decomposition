import { scrollToBottom } from "./utilities.js";

const state = {
  messageString: "",
  userString: "",
  // backendURL: "https://tzemingho-chatapp-server-backend.hosting.codeyourfuture.io",
  backendURL: "http://localhost:4000",
  messages: [],
};

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

async function chatDisplay() {
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

const keepFetchingMessages = async () => {
  const lastMessageTime =
    state.messages.length > 0
      ? state.messages[state.messages.length - 1].timestamp
      : null;
  const queryString = lastMessageTime ? `?since=${lastMessageTime}` : "";
  const url = `${state.backendURL}/messages${queryString}`;
  try {
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    if (response.length > 0) {
      state.messages.push(...response);
      chatDisplay();
    }
  } catch (error) {
    console.log(`Failed on connection: ${error}`);
  }
  setTimeout(keepFetchingMessages, 100);
};

function messageInputReset() {
  state.messageString = "";
  state.userString = "";
  const messageInputElement = document.getElementById("message-input");
  const userInputElement = document.getElementById("user-name-input");
  messageInputElement.value = "";
  userInputElement.value = "";
}

async function postingMessage(messageString, userString) {
  try {
    const response = await fetch(state.backendURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageString,
        user: userString,
      }),
    });
    if (response.ok) {
      const confirmMessage = await response.text();
      if (confirmMessage == "sent") {
        chatDisplay();
        messageInputReset();
      }
    }
  } catch (error) {
    console.error(`Failed to post message: ${error}`);
  }
}

async function messageSubmitHandler(e, messageString, userString) {
  e.preventDefault();
  if (!messageString || !userString) {
    console.error(`Message or user cannot be empty.`);
    window.alert("Message or user cannot be empty.");
    return;
  } else {
    await postingMessage(messageString, userString);
  }
}

function messageInputHandler() {
  const messageInputElement = document.getElementById("message-input");
  messageInputElement.addEventListener("input", (e) => {
    state.messageString = e.target.value.trim();
  });

  const userInputElement = document.getElementById("user-name-input");
  userInputElement.addEventListener("input", (e) => {
    state.userString = e.target.value.trim();
  });

  document
    .getElementById("message-submit-button")
    .addEventListener("click", async (e) => {
      await messageSubmitHandler(e, state.messageString, state.userString);
    });
}

window.onload = async () => {
  keepFetchingMessages();
  messageInputHandler();
};
