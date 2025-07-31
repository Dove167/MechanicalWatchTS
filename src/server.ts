import express from 'express';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { MechanicalWatch } from './MechanicalWatch';

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new SocketIOServer(server); // Attach Socket.IO to HTTP server
const port = 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Create watch instance
const watch = new MechanicalWatch();

// Function to emit watch status
const emitWatchStatus = () => {
    const status = watch.getStatus();
    io.emit('watchStatus', status); // Emit status to all connected clients
};

// Routes
app.get('/', (req, res) => {
    const status = watch.getStatus();
    res.render('watch', {
        watch: status,
        title: 'Mechanical Watch Simulator'
    });
});

app.post('/start', (req, res) => {
    watch.start();
    emitWatchStatus(); // Emit status after action
    res.redirect('/');
});

app.post('/stop', (req, res) => {
    watch.stop();
    emitWatchStatus(); // Emit status after action
    res.redirect('/');
});

app.post('/wind', (req, res) => {
    watch.windWatch();
    emitWatchStatus(); // Emit status after action
    res.redirect('/');
});

app.post('/tick', (req, res) => {
    watch.tick();
    emitWatchStatus(); // Emit status after action
    res.redirect('/');
});

app.post('/regulate-faster', (req, res) => {
    watch.regulateWatch('faster');
    emitWatchStatus();
    res.redirect('/');
});

app.post('/regulate-slower', (req, res) => {
    watch.regulateWatch('slower');
    emitWatchStatus();
    res.redirect('/');
});

app.post('/shock', (req, res) => {
    // Simulate a random shock force between 1000G and 10000G
    const force = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    watch.simulateShock(force);
    emitWatchStatus();
    res.redirect('/');
});

// Route for statistics page
app.get('/stats', (req, res) => {
    const status = watch.getStatus();
    res.render('stats', {
        title: 'Watch Statistics',
        watch: status
    });
});

app.post('/reset-stats', (req, res) => {
    // In a real application, you might reset internal stats here
    console.log('Statistics reset');
    res.json({ success: true });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    emitWatchStatus(); // Emit current status to new client on connection

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
server.listen(port, () => { // Listen on the HTTP server, not the Express app
    console.log(`🕰️  Mechanical Watch Server running at http://localhost:${port}`);
    
    // Start the watch automatically and simulate some ticks
    watch.start();
    emitWatchStatus(); // Initial emit

    // Simulate ticking every second and emit updates
    setInterval(() => {
        if (watch.isRunning) {
            watch.tick();
            emitWatchStatus(); // Emit status after each tick
        }
    }, 1000);
});
