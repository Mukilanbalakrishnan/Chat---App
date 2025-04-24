const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");


const app = express();


app.use(cors());


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


// socket connection

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    io.emit("receive_message", data);
  });


  // socket disconnection

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



// to start the server on port number 3001
server.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});
