const path = require("path");
const http = require("http");
const express = require("express");
const redis = require("redis");
const WebSocketServer = require("ws").Server;
let staticFilePath = path.join(process.cwd(), "public");
const app = express();
app.use(express.static("public"));

let redisSub = redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});
let redisPub = redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (msg) => {
    console.log("Message: " + msg);
    redisPub.publish("chat_messages", msg);
  });
});

redisSub.subscribe("chat_messages");
redisSub.on("message", (channel, msg) => {
  wss.clients.forEach((client) => {
    client.send(msg);
  });
});

server.listen(process.argv[2] || 8080, () => console.log("Server is on"));
