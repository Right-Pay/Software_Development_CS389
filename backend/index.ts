import express, { Express, ErrorRequestHandler, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import helmet from "helmet";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'http://localhost:3001/',
  issuerBaseURL: 'https://dev-6uux541sywon80js.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const authorizationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ error: 'Unathorized', message: err.message, success: false });
    } else {
        next(err);
    }
};

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const clientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!', message: err.message, success: false })
  } else {
    next(err)
  }
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// const UserRouter = require('./routes/UserRouter');

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Server is listening on port", port);
});

app.get("/api/test", checkJwt, (req: Request, res: Response) => {
    res.send("Test route");
    const auth = req.auth;
    auth?.token; // The raw JWT token
    console.log(auth);
});

app.get("/", (req: Request, res: Response) => {
    res.send("TLX API - Backend");
});

app.use(authorizationErrorHandler);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
