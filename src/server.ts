import express from 'express';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import WatchEngine from './engine/WatchEngine';
import { ComponentStatus } from './types/d.types';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const port = 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create watch engine instance
const watchEngine = new WatchEngine();

// Function to emit watch status
const emitWatchStatus = () => {
    io.emit('watchStatus', watchEngine.state);
};

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// API routes for watch controls
app.post('/api/start', (req, res) => {
    watchEngine.start();
    emitWatchStatus();
    res.json({ success: true });
});

app.post('/api/stop', (req, res) => {
    watchEngine.stop();
    emitWatchStatus();
    res.json({ success: true });
});

app.post('/api/wind', (req, res) => {
    watchEngine.wind();
    emitWatchStatus();
    res.json({ success: true });
});

app.post('/api/shock', (req, res) => {
    watchEngine.shock();
    emitWatchStatus();
    res.json({ success: true });
});

app.post('/api/service', (req, res) => {
    // Service all components
    const state = watchEngine.state;
    state.components.forEach((component) => {
        component.health = 95 + Math.random() * 5;
        component.status = state.isRunning ? ComponentStatus.RUNNING : ComponentStatus.STOPPED;
    });
    emitWatchStatus();
    res.json({ success: true });
});

app.post('/api/reset', (req, res) => {
    // In a real application, you might want to create a new engine instance
    // For now, we'll just stop the watch
    watchEngine.stop();
    emitWatchStatus();
    res.json({ success: true });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    emitWatchStatus(); // Emit current status to new client

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
server.listen(port, () => {
    console.log(`🕰️  Mechanical Watch Server running at http://localhost:${port}`);
    
    // Start emitting status updates periodically
    setInterval(() => {
        emitWatchStatus();
    }, 1000); // Emit status every second
});
