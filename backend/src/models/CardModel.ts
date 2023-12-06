// generate a card model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Card } from "../types/cardTypes";
import { Reward, RewardType } from "../types/rewardTypes";
import RewardModelInstance from "./RewardModel";

export class CardModel {

  async create(card: Card): Promise<Card> {
    try {
      const client = await dbPool.connect();
      const cardCheck = await this.getByBin(card.card_bin);
      if (cardCheck && cardCheck.card_bin === card.card_bin && cardCheck.card_name === card.card_name && cardCheck.card_brand_id === card.card_brand_id && cardCheck.card_bank_id === card.card_bank_id && cardCheck.card_type === card.card_type && cardCheck.card_level === card.card_level && cardCheck.card_country === card.card_country) {
        throw new Error('error.cardFound');
      }
      const sql = 'INSERT INTO rp_cards (card_bin, card_name, card_brand_id, card_bank_id, card_type, card_level, card_country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [card.card_bin, card.card_name, card.card_brand_id, card.card_bank_id, card.card_type, card.card_level, card.card_country];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.cardNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }

  async get(card_id: number): Promise<Card | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_cards WHERE id = $1';
      const values = [card_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        for (const row of result.rows) {
          // get rewards for card
          row.rewards = [];
          if (row.id) {
            row.rewards = await RewardModelInstance.getByCard(row.id);
            row.rewards = row.rewards.filter((reward: Reward) => {
              return reward.crowd_source_score && Number(reward.crowd_source_score) >= 2;
            });
          }
        }
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }

  async getByBin(card_bin: number): Promise<Card | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_cards WHERE card_bin = $1';
      const values = [card_bin];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        for (const row of result.rows) {
          // get rewards for card
          row.rewards = [];
          if (row.id) {
            row.rewards = await RewardModelInstance.getByCard(row.id);
            row.rewards = row.rewards.filter((reward: Reward) => {
              return reward.crowd_source_score && Number(reward.crowd_source_score) >= 2;
            });
          }
        }
        return result.rows[0];
      } else {
        // check api, if in api then create card and return it here, if not return null
        // and have user input it manually to crowd source
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }


  async getByUser(user_id: number): Promise<Card[]> {
    try {
      const client = await dbPool.connect();
      const sql = `SELECT ucl.id as user_to_card_link_id, ucl.expiration_date as exp_date, ucl.date_created as date_card_linked, c.*
      FROM rp_user_to_card_link ucl
      LEFT JOIN rp_cards c ON c.id = ucl.card_id
      WHERE ucl.user_id = $1`;
      const values = [user_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        for (const row of result.rows) {
          // get rewards for card
          row.rewards = [];
          if (row.id) {
            row.rewards = await RewardModelInstance.getByCard(row.id);
          }
        }
        return result.rows;
      } else {
        return [];
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async updateApiCount(api_name: string) {
    try {
      const client = await dbPool.connect();
      const sql = 'UPDATE rp_api_calls SET api_count = api_count + 1 WHERE api_name = $1';
      const values = [api_name];
      const result = await client.query(sql, values);
      client.release();
      if (!result.rowCount) {
        throw new Error('error.apiCountNotUpdated');
      }
      return true;
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }

  async linkReward(card_id: number, reward_id: number, reward_type: RewardType): Promise<Reward> {
    try {
      const client = await dbPool.connect();
      const sql = 'INSERT INTO rp_card_to_reward_link (card_id, reward_id, reward_type) VALUES ($1, $2, $3) RETURNING *';
      const values = [card_id, reward_id, reward_type];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.cardNotLinked');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }

  async linkUserReward(user_id: number, card_id: number, user_to_card_link_id: number, card_to_reward_link_id: number): Promise<Card> {
    try {
      const client = await dbPool.connect();
      const sql = 'INSERT INTO rp_linked_user_card_to_reward_link (user_id, card_id, user_to_card_link_id, card_to_reward_link_id) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [user_id, card_id, user_to_card_link_id, card_to_reward_link_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.cardNotLinked');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }


  async delete(card_id: number): Promise<boolean> {
    try {
      const cardCheck = await this.get(card_id);
      if (cardCheck === null) {
        throw new Error('error.cardNotFound');
      }

      const sql = 'DELETE FROM rp_cards WHERE id = $1 RETURNING *';
      const values = [card_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const cardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(cardFriendlyError);
    }
  }

}

export const CardModelInstance = new CardModel();
export default CardModelInstance;