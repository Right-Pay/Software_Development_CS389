import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

const UserRouter = require('./routes/UserRouter');

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Server is listening on port", port);
});

app.get("/api/test", (req: Request, res: Response) => {
    res.send("Test route");
});

app.get("/", (req: Request, res: Response) => {
    res.send("TLX API - Backend");
});