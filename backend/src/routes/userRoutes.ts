import { Router, Request, Response, NextFunction } from 'express';
import checkJwt from '../middleware/authenticationMiddleware';
import { IJsonResponse } from '../types/jsonResponse';
import UserController from '../controllers/UserController';

const router = Router();

// Get User by ID
router.get("/", checkJwt, async (req: Request, res: Response) => await UserController.getUser(req, res))

// Register User
router.post("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await UserController.createUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

// Link User to Card
router.put("/linkCard", checkJwt, async (req: Request, res: Response) => await UserController.linkUserToCard(req, res))

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
router.delete("/", checkJwt, async (req: Request, res: Response) => {
  try {
    const sucess = await UserController.deleteUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

router.delete("/unlinkCard", checkJwt, async (req: Request, res: Response) => await UserController.unlinkUserFromCard(req, res))

export default router;