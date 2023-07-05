const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors")
const PORT = 5000;
app.use(cors())
let users = [];

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "https://regal-ganache-4e59f0.netlify.app"
    }
})

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected`);

    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
    });

    socket.on('newUser', (data) => {
        users.push(data);
        socketIO.emit('newUserResponse', users);
    });
    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


    socket.on('disconnect', () => {
        console.log("A user disconnected");
        users = users.filter((user) => user.socketID !== socket.id);
        socketIO.emit('newUSerResponse', users);
        socket.disconnect();
    })
})

app.get("/api", (req, res) => {
    res.json({ message: 'Hello world' })
})

http.listen(process.env.PORT || 5000, () => {
    console.log("Server listening on port 3000");
})
