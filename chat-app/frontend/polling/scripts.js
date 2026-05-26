import {
  scrollToBottom,
  createEmptyMessage,
  createMessageThreads,
  chatDisplay,
  messageInputReset,
  messageSubmitHandler,
  messageFormHandler,
} from "../utilities.js";

const state = {
  backendURL:
    "https://tzemingho-chatapp-server-backend.hosting.codeyourfuture.io",
  // backendURL: "http://localhost:4000",
  messages: [],
};

async function keepFetchingMessages() {
  const lastMessageTime = state.messages.at(-1)?.timestamp ?? null;
  const queryString = lastMessageTime ? `?since=${lastMessageTime}` : "";
  const url = `${state.backendURL}/messages${queryString}`;
  const milliseconds = 100;
  try {
    // fetch may remain pending up to 25 seconds
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    if (response.length > 0) {
      state.messages.push(...response);
      chatDisplay(state);
    }
  } catch (error) {
    console.log(`Failed on connection: ${error}`);
  }
  setTimeout(keepFetchingMessages, milliseconds);
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

window.onload = async () => {
  keepFetchingMessages();
  messageFormHandler();
};
