import { Router, Request, Response, NextFunction } from 'express';
import checkJwt from '../middleware/authenticationMiddleware';
import { IJsonResponse } from '../types/jsonResponse';
import BankController from '../controllers/BankController';

const router = Router();

// Get Bank by ID
router.get("/", checkJwt, async (req: Request, res: Response) => await BankController.getBank(req, res))

router.get("/all", checkJwt, async (req: Request, res: Response) => await BankController.getAllBanks(req, res))

// Register Bank
router.post("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await BankController.createBank(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

// Update Bank
router.put("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const response: IJsonResponse = {
    message: "TLX API - Update Bank",
    success: true,
    data: auth
  };
  res.json(response);
});

// Delete Bank
router.delete("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await BankController.deleteBank(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

export default router;