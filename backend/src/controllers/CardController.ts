import { Request, Response } from 'express';
import CardModel from '../models/CardModel';
import { IJsonResponse } from '../types/jsonResponse';
import { Card } from '../types/cardTypes';
import i18n from '../config/i18n';
import BankModelInstance from '../models/BankModel';
import BrandModelInstance from '../models/BrandModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

class CardController {
  async getCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('card_id') && Number.isNaN(Number(req.query.card_id))) {
      response.success = false;
      response.message = i18n.t('error.cardNotFound');
      res.status(400).json(response);
      return;
    } else if (req.query.hasOwnProperty('card_bin') && Number.isNaN(Number(req.query.card_bin))) {
      response.success = false;
      response.message = i18n.t('error.cardNotFound');
      res.status(400).json(response);
      return;
    }
    const cardId: number = Number(req.query.card_id || 0);
    const cardBin: number = Number(req.query.card_bin || 0);
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
      const brand = await BrandModelInstance.get(cardData.card_brand_id);
      if (!bank) {
        throw new Error(i18n.t('error.bankNotFound'));
      }
      if (!brand) {
        throw new Error(i18n.t('error.brandNotFound'));
      }
      if (!cardData.card_name) {
        cardData.card_name = bank.bank_name + ' ' +
          cardData.card_level;
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

  async addCardsFromCSV(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    const banks = await BankModelInstance.getAll();
    const brands = await BrandModelInstance.getAll();
    const csvFilePath = path.join(__dirname, '../../src/binlist-data.csv');
    // 0.bin,1.brand,2.type,3.category,4.issuer(bank),5.alpha_2,6.alpha_3,7.country,8.latitude,9.longitude,10.bank_phone,11.bank_url
    try {
      const fileStream = fs.createReadStream(csvFilePath, 'utf-8');
      const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
      });
  
      const cardData = [] as Card[];
      let isFirstLine = true;
      for await (const line of rl) {
        if (isFirstLine) {
          isFirstLine = false;
          continue; // Skip the first line
        }

        const cardArray = line.split(',');

        const brand_name = cardArray[1];
        let brand_id = brands.find((brand) => brand.brand_name === brand_name)?.id || -1;
        if (brand_id === -1) {
          const new_brand = await BrandModelInstance.create({ brand_name });
          brand_id = new_brand.id || -1;
          brands.push(new_brand);
        }
        const bank_name = cardArray[4];
        let bank_id = banks.find((bank) => bank.bank_name === bank_name)?.id || -1;
        if (bank_id === -1) {
          const new_bank = await BankModelInstance.create({ bank_name, abbr: bank_name });
          bank_id = new_bank.id || -1;
          banks.push(new_bank);
        }

        const cardObject: Card = {
          card_bin: parseInt(cardArray[0]),
          card_brand_id: brand_id,
          card_type: cardArray[2],
          card_bank_id: bank_id,
          card_country: cardArray[7],
          card_level: cardArray[3] ? cardArray[3] : '',
          card_name: bank_name + ' ' + brand_name + ' ' + cardArray[3] + ' ' + cardArray[2],
        };

        const newCard = await CardModel.create(cardObject);
        cardData.push(newCard);
      };
      response.data = cardData;
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message + ' - failed at cardData.map';
      response.data = {};
      res.status(500).json(response);
    }
  }

}

export default new CardController();
