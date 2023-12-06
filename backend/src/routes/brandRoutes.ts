import { Request, Response, Router } from 'express';
import BrandController from '../controllers/BrandController';
import checkJwt from '../middleware/authenticationMiddleware';

const router = Router();

// Get Brand by ID
router.get("/", checkJwt, async (req: Request, res: Response) => await BrandController.getBrand(req, res))

router.get("/all", checkJwt, async (req: Request, res: Response) => await BrandController.getAllBrands(req, res))

// Register Brand
// router.post("/", checkJwt, async (req: Request, res: Response) => {
//   try {
//     await BrandController.createBrand(req, res);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', sucess: false });
//   }
// });

// Update Brand
// router.put("/", checkJwt, (req: Request, res: Response) => {
//   const auth = req.auth;
//   const response: IJsonResponse = {
//     message: "TLX API - Update Brand",
//     success: true,
//     data: auth
//   };
//   res.json(response);
// });

// Delete Brand
// router.delete("/", checkJwt, async (req: Request, res: Response) => {
//   try {
//     await BrandController.deleteBrand(req, res);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', sucess: false });
//   }
// });

export default router;