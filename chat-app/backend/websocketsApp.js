import express, { raw } from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";

const port = 4001;
const app = express();

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server: server });

const messages = [
  {
    "message": "Welcome to the channel",
    "user": "System"
  },
];

webSocketServer.on("connection", (clientCollection) => {
  console.log(`Client connected. Total clients: ${webSocketServer.clients.size}`);

  clientCollection.send(JSON.stringify({type: "HISTORY", data: messages}));

  clientCollection.on("message", (rawMessageString) => {
    try {
      const payload = JSON.parse(rawMessageString);

      if (payload.type === "NEW_MESSAGE") {
        const {message, user} = payload;
        const newMessage = {
          message: message,
          user: user,
          timeStamp: new Date().toISOString()
        };

        messages.push(newMessage);

        webSocketServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: "NEW_MESSAGE", data: newMessage}))
          }
        })
      }
    } catch (error) {
      console.error("Failed to parse incoming message from socket: ", error);
    }
  })

  clientCollection.on("close", () => {
    console.log(`Client disconnected. Total clients: ${webSocketServer.clients.size}`);
  })
});

server.listen(port, () => {
  console.log(`Server runs on port: ${port}`);
})
