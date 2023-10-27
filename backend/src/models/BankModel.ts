// generate a bank model that will be used to interact with the database
import { dbPool } from "../config/config";
import { Bank } from "../types/bankTypes";
import i18n from '../config/i18n';

export class BankModel {

  async create(bank: Bank): Promise<Bank> {
    try {
      const client = await dbPool.connect();
      const bankCheck = await this.getByName(bank.bank_name);
      if (bankCheck) {
        throw new Error('error.bankFound');
      }
      const sql = 'INSERT INTO rp_banks (bank_name, abbr) VALUES ($1, $2) RETURNING *';
      const values = [bank.bank_name, bank.abbr.toLowerCase()];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.bankNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const bankFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(bankFriendlyError);
    }
  }

  async get(bank_id: number): Promise<Bank | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_banks WHERE id = $1';
      const values = [bank_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const bankFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(bankFriendlyError);
    }
  }

  async getByName(bank_name: string): Promise<Bank | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_banks WHERE bank_name = $1';
      const values = [bank_name];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const bankFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(bankFriendlyError);
    }
  }

  async getAll(): Promise<Bank[]> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_banks';
      const result = await client.query(sql);
      client.release();
      if (result.rows.length) {
        return result.rows;
      } else {
        return [];
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const bankFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(bankFriendlyError);
    }
  }

  async delete(bank_id: number): Promise<boolean> {
    try {
      const bankCheck = await this.get(bank_id);
      if (bankCheck === null) {
        throw new Error('error.bankNotFound');
      }

      const sql = 'DELETE FROM rp_banks WHERE id = $1 RETURNING *';
      const values = [bank_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const bankFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(bankFriendlyError);
    }
  }

}

export const BankModelInstance = new BankModel();
export default BankModelInstance;