import { Request, Response, Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import checkJwt from '../middleware/authenticationMiddleware';
import { IJsonResponse } from '../types/jsonResponse';

const router = Router();

// Get Category by ID
router.get("/", checkJwt, async (req: Request, res: Response) => await CategoryController.getCategory(req, res))

router.get("/all", checkJwt, async (req: Request, res: Response) => await CategoryController.getAllCategories(req, res))

// Register Category
router.post("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await CategoryController.createCategory(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

// Update Category
router.put("/", checkJwt, (req: Request, res: Response) => {
  const auth = req.auth;
  const response: IJsonResponse = {
    message: "TLX API - Update Category",
    success: true,
    data: auth
  };
  res.json(response);
});

// Delete Category
router.delete("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await CategoryController.deleteCategory(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

export default router;