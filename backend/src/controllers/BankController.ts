import { Request, Response } from 'express';
import BankModel from '../models/BankModel';
import { IJsonResponse } from '../types/jsonResponse';
import { Bank } from '../types/bankTypes';
import i18n from '../config/i18n';

class BankController {
  async getBank(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get Bank',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('bank_id') && Number.isNaN(Number(req.query.bank_id))) {
      response.success = false;
      response.message = i18n.t('error.bankNotFound');
      res.status(400).json(response);
      return;
    }
    const bankId: number = Number(req.query.bank_id || 0);
    const bankName: string = String(req.query.bank_name || '');
    if (!bankId && !bankName) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      let bank;
      if (bankId) {
        bank = await BankModel.get(bankId);
      } else {
        bank = await BankModel.getByName(bankName);
      }
      if (bank) {
        response.data = bank;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.bankNotFound');
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

  //getAllBanks
  async getAllBanks(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get All Banks',
      success: true,
      data: {}
    };
    try {
      const banks = await BankModel.getAll();
      if (banks) {
        response.data = banks;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.bankNotFound');
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

  async createBank(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Bank',
      success: true,
      data: {}
    };
    const bankData = req.body as Bank;
    if (!bankData.bank_name || !bankData.abbr) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const newBank = await BankModel.create(bankData);
      response.data = newBank;
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async deleteBank(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Delete Bank',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.unauthorized');
      res.status(401).json(response);
      return;
    }
    const bankId = req.body.bank_id;
    if (!bankId) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      throw new Error(i18n.t('error.notAllowedAtThisTime'));
      const bankDeleted = await BankModel.delete(bankId);
      if (bankDeleted) {
        response.data = bankDeleted;
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

export default new BankController();
