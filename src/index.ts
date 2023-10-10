import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.path, req.method);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the app!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port`, process.env.PORT);
});
