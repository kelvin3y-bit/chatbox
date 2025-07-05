const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*'}
});

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add user to online users
    onlineUsers[socket.id] = { id: socket.id, status: 'online' };
    io.emit('updateOnlineUsers', Object.values(onlineUsers));

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete onlineUsers[socket.id];
        io.emit('updateOnlineUsers', Object.values(onlineUsers));
    });

    // Handle user status update
    socket.on('updateStatus', (status) => {
        if (onlineUsers[socket.id]) {
            onlineUsers[socket.id].status = status;
            io.emit('updateOnlineUsers', Object.values(onlineUsers));
        }
    });
});

server.listen(5000,() => console.log('server running on http://localhost:5000'));