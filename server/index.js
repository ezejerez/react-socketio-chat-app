import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";

import { PORT } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const date = new Date();
const timeStamp = `${date.getHours()}:${date.getMinutes()}`;

app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {
  // console.log(socket.id);

  socket.on("message", (message) => {
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
      timeStamp: timeStamp,
    });
  });
});

server.listen(PORT);
