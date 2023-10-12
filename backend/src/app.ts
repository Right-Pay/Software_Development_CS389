import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import ErrorHandlers from './middleware/errorHandling';
import UserRouter from './routes/userRoutes';
import DefaultRotuer from './routes/defaultRoutes';

dotenv.config();

const app: Express = express();

// Configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes

app.use('/', DefaultRotuer);
app.use('/users', UserRouter);


// Needs to be last

app.use(ErrorHandlers);

export default app;