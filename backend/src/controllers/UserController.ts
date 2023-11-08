import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { IJsonResponse } from '../types/jsonResponse';
import { User } from '../types/userTypes';
import i18n from '../config/i18n';

class UserController {
  async getUser(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register User1',
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
}

export default new UserController();
