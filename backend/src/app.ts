import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Express } from 'express';
import helmet from "helmet";
import ErrorHandlers from './middleware/errorHandling';
import { languageMiddleware } from './middleware/i18nMiddleware';
import BankRouter from './routes/bankRoutes';
import BrandRouter from './routes/brandRoutes';
import CardRouter from './routes/cardRoutes';
import CategoryRouter from './routes/categoryRoutes';
import DefaultRotuer from './routes/defaultRoutes';
import UserRouter from './routes/userRoutes';


const app: Express = express();

// Configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(languageMiddleware);

// Routes

app.use('/api', DefaultRotuer);
app.use('/api/users', UserRouter);
app.use('/api/banks', BankRouter);
app.use('/api/brands', BrandRouter);
app.use('/api/cards', CardRouter);
app.use('/api/categories', CategoryRouter);

// Needs to be last

app.use(ErrorHandlers);

export default app;