import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    // origin: "https://tzemingho-chatapp-server-frontend.hosting.codeyourfuture.io"
  }),
);
app.use(express.json());
const port = 4000;

const waitingRoom = [];

const chatHistory = [
  {
    message: "Welcome to the channel.",
    user: "System",
    timestamp: new Date().getTime(),
  },
];

app.get("/", (req, res) => {
  res.json(chatHistory);
});

app.get("/messages", (req, res) => {
  const since = parseInt(req.query.since);

  if (isNaN(since)) {
    return res.json(chatHistory);
  }
  const newMessages = chatHistory.filter(({ timestamp }) => timestamp > since);

  if (newMessages.length > 0) {
    return res.json(newMessages);
  }

  const callback = (message) => res.json([message]);
  waitingRoom.push(callback);

  const seconds = 25;
  const milliseconds = 1000;

  const timeout = setTimeout(() => {
    const index = waitingRoom.indexOf(callback);
    if (index !== -1) {
      waitingRoom.splice(index, 1);
      res.send([]);
    }
  }, seconds * milliseconds);
});

app.post("/", (req, res) => {
  try {
    let { message, user } = req.body;
    if (!message?.trim() || !user?.trim()) {
      res.status(406).json({ error: "Empty message or user are not allowed." });
      return;
    } else {
      const newTimestamp = new Date().getTime();
      const newMessage = {
        message: message,
        user: user,
        timestamp: newTimestamp,
      };
      chatHistory.push(newMessage);

      while (waitingRoom.length > 0) {
        const callback = waitingRoom.pop();
        callback(newMessage);
      }
      res.status(201).send("sent");
    }
  } catch (error) {
    console.error(`Failed to parse body as JSON: ${error}`);
    res.status(400).json({ error: "Expected body to be JSON." });
    return;
  }
});

app.listen(port, () => {
  console.log(`chatApp server is listening on port: ${port}`);
});
