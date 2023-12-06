import { Request, Response, Router } from 'express';
import CardController from '../controllers/CardController';
import checkJwt from '../middleware/authenticationMiddleware';

const router = Router();

// Get Card by ID
router.get("/", checkJwt, async (req: Request, res: Response) => await CardController.getCard(req, res))

router.get("/rapidapi", checkJwt, async (req: Request, res: Response) => await CardController.getCardFromAPI(req, res))

// router.get("/all", checkJwt, async (req: Request, res: Response) => await CardController.getAllCards(req, res))

// Link Card to Reward
router.put("/linkReward", checkJwt, async (req: Request, res: Response) => await CardController.linkRewardToCard(req, res))

// Register Card
router.post("/", checkJwt, async (req: Request, res: Response) => {
  try {
    await CardController.createCard(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', sucess: false });
  }
});

// Update Card
// router.put("/", checkJwt, (req: Request, res: Response) => {
//   const auth = req.auth;
//   const response: IJsonResponse = {
//     message: "TLX API - Update Card",
//     success: true,
//     data: auth
//   };
//   res.json(response);
// });

// Delete Card
// router.delete("/", checkJwt, async (req: Request, res: Response) => {
//   try {
//     await CardController.deleteCard(req, res);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', sucess: false });
//   }
// });

// not used anymore
// router.post("/import-csv", checkJwt, async (req: Request, res: Response) => await CardController.addCardsFromCSV(req, res));

export default router;