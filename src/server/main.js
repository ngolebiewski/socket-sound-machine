import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import ViteExpress from 'vite-express';

const app = express();
const PORT = process.env.PORT || 3000;

// Create a custom HTTP server with express app
const httpServer = createServer(app);

// Initialize Socket.IO server with HTTP server instance
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    // origin: true,
    methods: ["GET", "POST"],
    credentials: true,
    // allowedHeaders: ["my-custom-header"]
  }
});

// Serve static files from the public folder
app.use(express.static('public'));

// Add a test route
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

// Handle socket.io events
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('playSound', (index) => {
    console.log('Received playSound event with index:', index);
    io.emit('playSound', index); // Broadcast the sound to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// Handle server start and errors
httpServer.on('listening', () => {
  console.log(`Server is listening on port ${PORT}...`);
  console.log(`Test the server by visiting: http://localhost:${PORT}/test`);
});

httpServer.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1); // Exit the process on server error
});

// // Use ViteExpress to handle Vite's middleware
// ViteExpress.config({ mode: 'development' });

// Start the server
const startServer = async () => {
  try {
    ViteExpress.listen(app, PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
      console.log(`Test the server by visiting: http://localhost:${PORT}/test`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();