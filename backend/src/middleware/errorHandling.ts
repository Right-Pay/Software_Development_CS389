import { ErrorRequestHandler } from "express";

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

const errorHandlers = [authorizationErrorHandler, logErrors, clientErrorHandler, errorHandler];

export default errorHandlers;

export { authorizationErrorHandler, logErrors, clientErrorHandler, errorHandler };