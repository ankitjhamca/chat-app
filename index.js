const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    
    // Handle new user joining
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // Broadcast to others
    });

    // Handle sending a message
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            delete users[socket.id]; // Remove user from the users list
            socket.broadcast.emit('user-left', userName); // Notify others that the user left
        }
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
