import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { IJsonResponse } from '../types/jsonResponse';
import { User } from '../types/userTypes';
import i18n from '../config/i18n';
import CardModelInstance from '../models/CardModel';
import { Card } from '../types/cardTypes';

class UserController {
  async getUser(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register User',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.default');
      res.status(401).json(response);
      return;
    }
    const userId = req.auth?.payload.sub;
    try {
      const user = await UserModel.get(userId);
      if (user) {
        response.data = user;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.userNotFound');
        res.status(404).json(response);
      }
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async createUser(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register User',
      success: true,
      data: {}
    };
    const userData = req.body as User;
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.default');
      res.status(401).json(response);
      return;
    }
    userData.auth_id = req.auth?.payload.sub;
    userData.auth_token = req.auth?.token;
    if (!userData.username || !userData.email) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const newUser = await UserModel.create(userData);
      response.data = newUser;
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async deleteUser(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Delete User',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.unauthorized');
      res.status(401).json(response);
      return;
    }
    const userId = req.auth?.payload.sub;
    try {
      const userDeleted = await UserModel.delete(userId);
      if (userDeleted) {
        response.data = userDeleted;
        res.json(response);
      }
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
  }

  async linkUserToCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Link User to Card',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.default');
      res.status(401).json(response);
      return;
    }
    const userId = req.auth?.payload.sub;
    const cardId = req.body.card_id;
    const newCard = req.body.new_card;
    // get current year
    let year = new Date().getFullYear().toString().slice(0, 2);
    const expDate = year + req.body.exp_date + '-01';
    if ((!cardId || !newCard) && !expDate) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      if (cardId) {
        const userLinked = await UserModel.link_card(userId, cardId, expDate);
        if (userLinked) {
          response.data = userLinked;
          res.status(201).json(response);
        } else {
          response.success = false;
          response.message = i18n.t('error.default');
          res.status(500).json(response);
        }
      } else {
        let newCardId = -1;
        // trying to create new card using fields given
        // if it fails and it is a duplicate card, then just link user to existing card
        try {
          const newlyCreatedCard = await CardModelInstance.create(newCard);
          if (newlyCreatedCard) {
            newCardId = newlyCreatedCard?.id || -1;
          }
        } catch (error: any) {
          if (error.message === 'error.cardFound') {
            let existingCard: Card = {} as Card;
            if (newCard.id) {
              existingCard = await CardModelInstance.get(newCard.id) || {} as Card;
            } else {
              existingCard = await CardModelInstance.getByBin(newCard.card_bin) || {} as Card;
            }
            if (existingCard) {
              newCardId = existingCard?.id || -1;
            }
          } else {
            throw new Error(error.message);
          }
        }
        if (newCardId === -1) {
          response.success = false;
          response.message = i18n.t('error.default');
          res.status(500).json(response);
          return;
        }
        const userLinked = await UserModel.link_card(userId, newCardId, expDate);
        if (userLinked) {
          response.data = userLinked;
          res.status(201).json(response);
        } else {
          response.success = false;
          response.message = i18n.t('error.default');
          res.status(500).json(response);
        }
      }
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async unlinkUserFromCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Unlink User from Card',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.default');
      res.status(401).json(response);
      return;
    }
    const userId = req.auth?.payload.sub;
    const cardId = req.body.card_id;
    if (!cardId) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const userUnlinked = await UserModel.unlink_card(userId, cardId);
      if (userUnlinked) {
        response.data = userUnlinked;
        res.status(201).json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.default');
        res.status(500).json(response);
      }
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }
}

export default new UserController();
