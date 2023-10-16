import { ErrorRequestHandler } from "express";
import i18n from "../config/i18n";
import {changeLanguage} from "./i18nMiddleware";


const authorizationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  changeLanguage(req.headers['x-preferred-language'] as string);
  if (err.name === 'UnauthorizedError') {
    // string to lowercase
    err.message = 'error.' + err.message.toLowerCase();
    res.status(401).send({ message: i18n.t(err.message) || i18n.t('error.default'), success: false });
  } else {
      next(err);
  }
};

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const clientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  changeLanguage(req.headers['x-preferred-language'] as string);
  if (req.xhr) {
    // string to lowercase
    err.message = 'error.' + err.message.toLowerCase();
    res.status(500).send({ message: i18n.t(err.message) || i18n.t('error.default'), success: false })
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