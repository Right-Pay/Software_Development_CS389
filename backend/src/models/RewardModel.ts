// generate a reward model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Reward } from "../types/rewardTypes";
import CategoryModelInstance from "./CategoryModel";

export class RewardModel {

  async create(reward: Reward): Promise<Reward> {
    try {
      const client = await dbPool.connect();
      const rewardCheck = await this.getByAllFields(reward);
      if (rewardCheck) {
        throw new Error('error.rewardFound');
      }
      const sql = 'INSERT INTO rp_cashback_rewards (category_id, initial_percentage, initial_limit, term_length_months, fallback_percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [reward.category_id, reward.initial_percentage, reward.initial_limit, reward.term_length_months, reward.fallback_percentage];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.rewardNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }

  async get(reward_id: number): Promise<Reward | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_cashback_rewards WHERE id = $1';
      const values = [reward_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }

  async getByAllFields(reward: Reward): Promise<Reward | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_cashback_rewards WHERE category_id = $1 AND initial_percentage = $2 AND initial_limit = $3 AND term_length_months = $4 AND fallback_percentage = $5';
      const values = [reward.category_id, reward.initial_percentage, reward.initial_limit, reward.term_length_months, reward.fallback_percentage];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }

  async getByCard(card_id: number): Promise<Reward[]> {
    try {
      const client = await dbPool.connect();
      const sql = `SELECT crl.id as card_to_reward_link_id, crl.reward_type, crl.date_created as date_reward_linked, crl.crowd_source_score, r.*
      FROM rp_card_to_reward_link crl
      LEFT JOIN rp_cashback_rewards r ON r.id = crl.reward_id
      WHERE crl.card_id = $1`;
      const values = [card_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        for (const row of result.rows as Reward[]) {
          // get rewards for card
          const category = await CategoryModelInstance.get(row.category_id);
          row.category = category || undefined;
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

  async getByUserCard(user_id: number, card_id: number): Promise<Reward[]> {
    try {
      const client = await dbPool.connect();
      const sql = `SELECT lucrl.id as linked_user_card_to_reward_link_id, crl.id as card_to_reward_link_id, crl.reward_type, crl.date_created as date_reward_linked, crl.crowd_source_score, r.*
      FROM rp_linked_user_card_to_reward_link lucrl
      LEFT JOIN rp_card_to_reward_link crl ON crl.id = lucrl.card_to_reward_link_id
      LEFT JOIN rp_cashback_rewards r ON r.id = crl.reward_id
      WHERE lucrl.card_id = $1 AND lucrl.user_id = $2`;
      const values = [card_id, user_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length as number) {
        for (const row of result.rows as Reward[]) {
          // get rewards for card
          const category = await CategoryModelInstance.get(row.category_id);
          row.category = category || undefined;
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

  async incrementCrowdSourceScore(card_id: number, reward_id: number): Promise<Reward> {
    try {
      const client = await dbPool.connect();
      const sql = 'UPDATE rp_card_to_reward_link SET crowd_source_score = crowd_source_score + 1 WHERE card_id = $1 AND reward_id = $2 RETURNING *';
      const values = [card_id, reward_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.rewardNotUpdated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }

  // async delete(reward_id: number): Promise<boolean> {
  //   try {
  //     const rewardCheck = await this.get(reward_id);
  //     if (rewardCheck === null) {
  //       throw new Error('error.rewardNotFound');
  //     }

  //     const sql = 'DELETE FROM rp_cashback_rewards WHERE id = $1 RETURNING *';
  //     const values = [reward_id];
  //     const result = await dbPool.query(sql, values);

  //     return result.rows.length > 0;
  //   } catch (err: any) {
  //     console.log('DB Error', err);
  //     const rewardFriendlyError = i18n.t([err.message, 'error.default']);
  //     throw new Error(rewardFriendlyError);
  //   }
  // }

}

export const RewardModelInstance = new RewardModel();
export default RewardModelInstance;