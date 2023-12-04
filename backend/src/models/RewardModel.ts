// generate a reward model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Reward } from "../types/rewardTypes";

export class RewardModel {

  async create(reward: Reward): Promise<Reward> {
    try {
      const client = await dbPool.connect();
      const rewardCheck = await this.getByBin(reward.reward_bin);
      if (rewardCheck && rewardCheck.reward_bin === reward.reward_bin && rewardCheck.reward_name === reward.reward_name && rewardCheck.reward_brand_id === reward.reward_brand_id && rewardCheck.reward_bank_id === reward.reward_bank_id && rewardCheck.reward_type === reward.reward_type && rewardCheck.reward_level === reward.reward_level && rewardCheck.reward_country === reward.reward_country) {
        throw new Error('error.rewardFound');
      }
      const sql = 'INSERT INTO rp_rewards (reward_bin, reward_name, reward_brand_id, reward_bank_id, reward_type, reward_level, reward_country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [reward.reward_bin, reward.reward_name, reward.reward_brand_id, reward.reward_bank_id, reward.reward_type, reward.reward_level, reward.reward_country];
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
      const sql = 'SELECT * FROM rp_rewards WHERE id = $1';
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

  async getByBin(reward_bin: number): Promise<Reward | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_rewards WHERE reward_bin = $1';
      const values = [reward_bin];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        // check api, if in api then create reward and return it here, if not return null
        // and have user input it manually to crowd source
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }


  async getByUser(user_id: number): Promise<Reward[]> {
    try {
      const client = await dbPool.connect();
      const sql = `SELECT ucl.expiration_date as exp_date, ucl.date_created as date_reward_linked, c.*
      FROM rp_user_to_reward_link ucl
      LEFT JOIN rp_rewards c ON c.id = ucl.reward_id
      WHERE ucl.user_id = $1`;
      const values = [user_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
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

  async delete(reward_id: number): Promise<boolean> {
    try {
      const rewardCheck = await this.get(reward_id);
      if (rewardCheck === null) {
        throw new Error('error.rewardNotFound');
      }

      const sql = 'DELETE FROM rp_rewards WHERE id = $1 RETURNING *';
      const values = [reward_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const rewardFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(rewardFriendlyError);
    }
  }

}

export const RewardModelInstance = new RewardModel();
export default RewardModelInstance;