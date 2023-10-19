import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import userRoutes from './routes/user'; // Correct the import statement for userRoutes
import cors from 'cors';

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