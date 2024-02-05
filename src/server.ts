import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import userRoutes from './routes/user'; // Correct the import statement for userRoutes
import questionRoutes from './routes/question'; // Import questionRoutes
import examRoutes from './routes/exam'; // Import examRoutes
import partRoutes from './routes/part'; // Import partRoutes
import cors from 'cors';
import scoreRoutes from "./routes/score";

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

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

// check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI must be defined");
    process.exit(1);
}

// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });