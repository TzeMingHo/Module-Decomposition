import {
  scrollToBottom,
  createEmptyMessage,
  createMessageThreads,
  chatDisplay,
  messageInputReset,
} from "../utilities.js";

const state = {
  // backendURL:
  //   "https://tzemingho-chatapp-server-backend.hosting.codeyourfuture.io",
  backendURL: "http://localhost:4001",
  messages: [],
};

let socket;

function initializeWebSockets() {
  const socketURL = state.backendURL.replace(/^http/, "ws");
  const milliseconds = 3000;

  socket = new WebSocket(socketURL);

  socket.addEventListener("message", (e) => {
    const payload = JSON.parse(e.data);

    if (payload.type === "HISTORY") {
      state.messages = payload.data;
    } else if (payload.type === "NEW_MESSAGE") {
      state.messages.push(payload.data);
    } else if (payload.type === "UPDATE_MESSAGE") {
      const index = state.messages.findIndex((message) => message.id === payload.data.id);
      if (index !== -1) {
        state.messages[index] = payload.data;
      }
    }
    chatDisplay(state, socket);
  });

  socket.addEventListener("close", () => {
    console.warn("WebSocket disconnected.")
    setTimeout(initializeWebSockets, milliseconds)
  })
}

function postingMessage(messageString, userString, socketInstance) {
  if (!socketInstance || socketInstance.readyState !== WebSocket.OPEN) {
    console.error("Cannot send message: Websocket is offline.");
    window.alert("Currently office.");
    return;
  }

  const payload = {
    type: "NEW_MESSAGE",
    message: messageString,
    user: userString
  }

  socketInstance.send(JSON.stringify(payload));

  messageInputReset();
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
    await postingMessage(messageString, userString, socket);
  }
}

function messageFormHandler() {
  const formElement = document.getElementById("message-form");
  formElement.addEventListener("submit", messageSubmitHandler);
}

window.onload = async () => {
  initializeWebSockets();
  messageFormHandler();
};
