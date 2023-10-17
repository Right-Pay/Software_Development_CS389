import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

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