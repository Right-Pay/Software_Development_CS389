import { Router, Request, Response, NextFunction } from 'express';
import checkJwt from '../middleware/authenticationMiddleware';
import { IJsonResponse } from '../types/jsonResponse';

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const response: IJsonResponse = {
    message: "TLX API - Users",
    success: true
  };
  res.json(response);
});

router.get("/:id", checkJwt, (req: Request, res: Response) => {
  const response: IJsonResponse = {
    message: "TLX API - User by ID " + req.params.id,
    success: true,
    data: req.auth
  };
  res.json(response);
  // const auth = req.auth;
  // auth?.token; // The raw JWT token
  // console.log(auth);
});


export default router;