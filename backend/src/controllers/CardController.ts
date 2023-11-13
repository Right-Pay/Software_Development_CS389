import { Request, Response } from 'express';
import CardModel from '../models/CardModel';
import { IJsonResponse } from '../types/jsonResponse';
import { Card } from '../types/cardTypes';
import i18n from '../config/i18n';
import BankModelInstance from '../models/BankModel';

class CardController {
  async getCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    const cardId: number = req.body.card_id;
    const cardBin: number = req.body.card_bin;
    if (!cardId && !cardBin) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      let card;
      if (cardId) {
        card = await CardModel.get(cardId);
      } else {
        card = await CardModel.getByBin(cardBin);
      }
      if (card) {
        response.data = card;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.cardNotFound');
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

  async createCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    const cardData = req.body as Card;
    if (!cardData.card_bin || !cardData.card_bank_id || !cardData.card_brand_id || !cardData.card_type || !cardData.card_level) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const bank = await BankModelInstance.get(cardData.card_bank_id);
      if (!bank) {
        throw new Error(i18n.t('error.bankNotFound'));
      }
      if (!cardData.card_name) {
        cardData.card_name = bank.bank_name + ' ' +
          cardData.card_type + ' ' +
          cardData.card_level + ' ' +
          cardData.card_type.charAt(0).toUpperCase() + cardData.card_level.slice(1);
      }
      const newCard = await CardModel.create(cardData);
      response.data = newCard;
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async deleteCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Delete Card',
      success: true,
      data: {}
    };
    const cardId = req.body.card_id;
    try {
      throw new Error(i18n.t('error.notAllowedAtThisTime'));
      const cardDeleted = await CardModel.delete(cardId);
      if (cardDeleted) {
        response.data = cardDeleted;
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

export default new CardController();
