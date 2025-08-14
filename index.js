const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET","POST"]
  }
});

const PORT = process.env.PORT || 3000;

// In-memory message history (for demo). In production use a DB.
let messages = [];

// simple REST endpoint to fetch history
app.get('/history', (req, res) => {
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('client connected:', socket.id);

  // send current history to the connected client
  socket.emit('history', messages);

  socket.on('send-message', (payload, ack) => {
    // payload expected to be { id, user, text, ts }
    const msg = {
      ...payload,
      ts: payload.ts || Date.now()
    };
    messages.push(msg);

    // broadcast to everyone (including sender)
    io.emit('new-message', msg);

    // optional acknowledgement
    if (typeof ack === 'function') {
      ack({ status: 'ok', id: msg.id, ts: msg.ts });
    }
  });

  socket.on('disconnect', () => {
    console.log('client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
