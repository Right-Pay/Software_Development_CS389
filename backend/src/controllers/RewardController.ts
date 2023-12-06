import { Request, Response } from 'express';
import i18n from '../config/i18n';
import CategoryModelInstance from '../models/CategoryModel';
import RewardModel from '../models/RewardModel';
import { IJsonResponse } from '../types/jsonResponse';
import { Reward } from '../types/rewardTypes';

class RewardController {
  async getReward(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Reward',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('reward_id') && Number.isNaN(Number(req.query.reward_id))) {
      response.success = false;
      response.message = i18n.t('error.rewardNotFound');
      res.status(400).json(response);
      return;
    }
    const rewardId: number = Number(req.query.reward_id || 0);
    if (!rewardId) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const reward = await RewardModel.get(rewardId);
      if (reward) {
        response.data = reward;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.rewardNotFound');
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

  async createReward(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Reward',
      success: true,
      data: {}
    };
    const rewardData = req.body as Reward;
    if (!rewardData.category_id || !rewardData.initial_percentage || !rewardData.initial_limit || !rewardData.term_length_months || !rewardData.fallback_percentage) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const category = await CategoryModelInstance.get(rewardData.category_id);
      if (!category) {
        throw new Error(i18n.t('error.bankNotFound'));
      }
      const rewardCheck = await RewardModel.getByAllFields(rewardData);
      if (rewardCheck) {
        response.data = rewardCheck;
      } else {
        const newReward = await RewardModel.create(rewardData);
        response.data = newReward;
      }
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  // async deleteReward(req: Request, res: Response) {
  //   const response: IJsonResponse = {
  //     message: 'TLX API - Delete Reward',
  //     success: true,
  //     data: {}
  //   };
  //   const rewardId = req.body.reward_id;
  //   try {
  //     throw new Error(i18n.t('error.notAllowedAtThisTime'));
  //   } catch (error: any) {
  //     response.success = false;
  //     response.message = error.message;
  //     response.data = {};
  //     res.status(500).json(response);
  //   }
  // }
}

export default new RewardController();
