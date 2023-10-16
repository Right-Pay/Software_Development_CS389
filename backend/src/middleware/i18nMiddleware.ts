import { RequestHandler } from "express";
import i18next from "../config/i18n";

const languageCheck = (langauge: string) => {
  const supportedLanguages = ['en', 'es'];
  if (supportedLanguages.includes(langauge)) {
    return langauge;
  } else {
    return 'en';
  }
}

const changeLanguage = (langauge: string) => {
  i18next.changeLanguage(languageCheck(langauge));
}

const languageMiddleware: RequestHandler = (req, res, next) => {
  let userLanguage = req.headers['x-preferred-language'] || 'en'; // Get the user's preferred language from session (or any other source)
  if (userLanguage instanceof Array) {
    userLanguage = 'en';
  }
  changeLanguage(userLanguage);
  next();
}

export { languageMiddleware, changeLanguage };