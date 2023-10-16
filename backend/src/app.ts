import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import helmet from "helmet";
import ErrorHandlers from './middleware/errorHandling';
import { languageMiddleware } from './middleware/i18nMiddleware';
import UserRouter from './routes/userRoutes';
import DefaultRotuer from './routes/defaultRoutes';


const app: Express = express();

// Configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(languageMiddleware);

// Routes

app.use('/', DefaultRotuer);
app.use('/users', UserRouter);


// Needs to be last

app.use(ErrorHandlers);

export default app;