const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = parseInt(process.env.PORT || "3001", 10);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for development)
    },
});

io.on("connection", (socket) => {

    console.log('CONNECTED', socket.id)

    socket.on('new_booking', (booking) => {
        socket.join(booking.id)
        io.emit('new_booking', booking)
    })

    socket.on('accepted_booking', (booking) => {
        socket.join(booking.id)
        io.to(booking.id).emit('accepted_booking', booking)
    })

    socket.on('pickup_passenger', (booking) => {
        io.to(booking.id).emit('pickup_passenger', booking)
    })

    socket.on('dropoff_passenger', (booking) => {
        io.to(booking.id).emit('dropoff_passenger', booking)
    })

});

server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
});
