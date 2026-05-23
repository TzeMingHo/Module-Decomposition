import {
  scrollToBottom,
  createEmptyMessage,
  createMessageThreads,
  chatDisplay,
  messageInputReset,
  messageSubmitHandler,
  messageInputHandler,
} from "../utilities.js";

const state = {
  messageString: "",
  userString: "",
  // backendURL: "https://tzemingho-chatapp-server-backend.hosting.codeyourfuture.io",
  backendURL: "http://localhost:4000",
  messages: [],
};

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
      chatDisplay(state);
    }
  } catch (error) {
    console.log(`Failed on connection: ${error}`);
  }
  setTimeout(keepFetchingMessages, 100);
};

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

window.onload = async () => {
  keepFetchingMessages();
  messageInputHandler();
};
