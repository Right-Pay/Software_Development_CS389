import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Server is listening on port 3000");
    // tslint:disable-next-line:no-console
    console.log("Running on http://localhost:3000");
});

app.get("/api/test", (req: Request, res: Response) => {
    res.send("Test route");
});

app.get("/", (req: Request, res: Response) => {
    res.send("TLX API - Backend");
});