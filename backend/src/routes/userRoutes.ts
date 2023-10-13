import { Router, Request, Response, NextFunction } from 'express';
import checkJwt from '../middleware/authenticationMiddleware';
import { IJsonResponse } from '../types/jsonResponse';

const router = Router();

// Get User by ID
router.get("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const token = auth?.token; // The raw JWT token
  const response: IJsonResponse = {
    message: "TLX API - User by ID " + auth?.payload.sub,
    success: true,
    data: auth
  };
  res.json(response);
});

// Register User
router.post("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const token = auth?.token; // The raw JWT token
  const data = req.body;
  const response: IJsonResponse = {
    message: "TLX API - Register User " + data.username + " " + auth?.payload.sub,
    success: true,
    data: auth
  };
  res.json(response);
});

// Update User
router.put("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const token = auth?.token; // The raw JWT token
  const data = req.body;
  const response: IJsonResponse = {
    message: "TLX API - Update User " + data.username + " " + auth?.payload.sub,
    success: true,
    data: auth
  };
  res.json(response);
});

// Delete User
router.delete("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const token = auth?.token; // The raw JWT token
  const data = req.body;
  const response: IJsonResponse = {
    message: "TLX API - Delete User " + data.username + " " + auth?.payload.sub,
    success: true,
    data: auth
  };
  res.json(response);
});

export default router;