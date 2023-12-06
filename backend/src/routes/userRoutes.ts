import { Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import checkJwt from '../middleware/authenticationMiddleware';

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
router.put("/", checkJwt, async (req: Request, res: Response) => await UserController.updateUser(req, res))

router.put("/addUserPoints", checkJwt, async (req: Request, res: Response) => await UserController.addUserPoints(req, res))

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