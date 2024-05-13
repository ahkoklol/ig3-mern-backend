import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import userRoutes from './routes/user'; // Correct the import statement for userRoutes
import questionRoutes from './routes/question'; // Import questionRoutes
import examRoutes from './routes/exam'; // Import examRoutes
import partRoutes from './routes/part'; // Import partRoutes
import cors from 'cors';
import scoreRoutes from "./routes/score";
import classRoutes from "./routes/class";

// express app
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://toeic-solo-leveling.cluster-ig3.igpolytech.fr"], // Adjust this to match your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Receive message along with user details
  socket.on('chat message', ({ user, text }) => {
    // Emit message along with user details to all clients
    socket.broadcast.emit('chat message', { user, text });
  });
});

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from uploads directory

app.use((req: Request, res: Response, next) => {
    console.log(req.method, req.path);
    next();
});

// routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Fix the route path and use userRoutes
app.use('/api/user', userRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/part', partRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/classes', classRoutes);

// check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI must be defined");
    process.exit(1);
}

// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });