import express from "express";
import cors from "cors";
import http from "http";
import { server as WebSocketServer } from "websocket";

const port = 4001;
const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ httpServer: server });

const clients = new Set();

webSocketServer.on("connection", (ws) => {
  clients.add(ws);
  console.log(`Client connected. Total clients: ${clients.size}`);

  ws.on("message", (rawData) => {
    try {
      const messageData = JSON.parse(rawData);
      console.log("Received:", messageData);

      const broadcastData = JSON.stringify(messageData);
      clients.forEach((client) => {
        if (client.readyState === 1) client.send(broadcastData);
      });
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });

  ws.on("close", () => {
    clients.deletes(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });

  server.listen(port, () => {
    console.log(`webSocketServer running on prot: ${port}`);
  });
});
