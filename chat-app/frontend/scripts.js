import { scrollToBottom } from "./utilities.js";

const state = {
  backendURL:
    "https://tzemingho-chatapp-server-backend.hosting.codeyourfuture.io",
  // backendURL: "http://localhost:4000",
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

async function keepFetchingMessages() {
  const lastMessageTime = state.messages.at(-1)?.timestamp ?? null;
  const queryString = lastMessageTime ? `?since=${lastMessageTime}` : "";
  const url = `${state.backendURL}/messages${queryString}`;
  const pollingIntervalMS = 100;
  try {
    // the backend is using long-polling, and will hang open for up to 25 seconds waiting for an update event before returning
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    if (response.length > 0) {
      state.messages.push(...response);
      chatDisplay();
    }
  } catch (error) {
    console.log(`Failed on connection: ${error}`);
  }
  setTimeout(keepFetchingMessages, pollingIntervalMS);
}

function messageInputReset() {
  const formElement = document.getElementById("message-form");
  formElement.reset();
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
        messageInputReset();
      }
    }
  } catch (error) {
    console.error(`Failed to post message: ${error}`);
  }
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

window.onload = async () => {
  keepFetchingMessages();
  messageFormHandler();
};
