// generate a user model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Bank } from "../types/bankTypes";
import { Brand } from "../types/brandTypes";
import { Card } from "../types/cardTypes";
import { User } from "../types/userTypes";
import BankModelInstance from "./BankModel";
import BrandModelInstance from "./BrandModel";
import CardModelInstance from "./CardModel";

export class UserModel {

  async create(user: User): Promise<User> {
    try {
      const client = await dbPool.connect();
      const userCheck = await this.get(user.auth_id);
      if (userCheck) {
        throw new Error('error.userFound');
      }
      const sql = 'INSERT INTO rp_users (username, email, auth_id, auth_token, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [user.username, user.email, user.auth_id, user.auth_token, user.phone];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async get(auth_id: string): Promise<User | null> {
    try {
      const client = await dbPool.connect();
      const sql = `SELECT * FROM rp_users u WHERE auth_id = $1`;
      const values = [auth_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        const user: User = result.rows[0];
        const banks: Bank[] = await BankModelInstance.getAll();
        const brands: Brand[] = await BrandModelInstance.getAll();
        let userCards: Card[] = await CardModelInstance.getByUser(user.id);

        user.cards = userCards;

        if (userCards.length) {
          user.cards.forEach((card: Card) => {
            const bank = banks.find((bank: Bank) => Number(bank.id) === Number(card.card_bank_id));
            if (bank) {
              card.card_bank_name = bank.bank_name;
              card.card_bank_abbr = bank.abbr;
            }
            const brand = brands.find((brand: Brand) => Number(brand.id) === Number(card.card_brand_id));
            if (brand) {
              card.card_brand_name = brand.brand_name;
            }
            card.rewards = [];
          });
        }
        return user;
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const client = await dbPool.connect();
      const userCheck = await this.get(user.auth_id);
      if (userCheck === null) {
        throw new Error('error.userNotFound');
      }
      const sql = 'UPDATE rp_users SET username = $1, phone = $2 WHERE auth_id = $3 RETURNING *';
      const values = [user.username, user.phone, user.auth_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userNotUpdated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async delete(auth_id: string): Promise<boolean> {
    try {
      const userCheck = await this.get(auth_id);
      if (userCheck === null) {
        throw new Error('error.userNotFound');
      }

      const sql = 'DELETE FROM rp_users WHERE auth_id = $1 RETURNING *';
      const values = [auth_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async link_card(auth_id: string, card_id: number, exp_date: string): Promise<Card> {
    try {
      if (!exp_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('error.invalidDate');
      }
      const client = await dbPool.connect();
      const userCheck = await this.get(auth_id);
      if (userCheck === null) {
        throw new Error('error.userNotFound');
      }
      const user_id = userCheck.id;
      const cardCheck = await CardModelInstance.get(card_id);
      if (cardCheck === null) {
        throw new Error('error.cardNotFound');
      }

      const sql_check = 'SELECT * FROM rp_user_to_card_link WHERE user_id = $1 AND card_id = $2';
      const values_check = [user_id, card_id];
      const result_check = await client.query(sql_check, values_check);
      if (result_check.rows.length) {
        throw new Error('error.userCardAlreadyLinked');
      }

      const sql = 'INSERT INTO rp_user_to_card_link (user_id, card_id, expiration_date) VALUES ($1, $2, $3) RETURNING *';
      const values = [user_id, card_id, exp_date];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userCardNotLinked');
      }
      client.release();
      return {...cardCheck,
        exp_date: exp_date
      };
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async unlink_card(auth_id: string, card_id: number): Promise<Card> {
    try {
      const client = await dbPool.connect();
      const userCheck = await this.get(auth_id);
      if (userCheck === null) {
        throw new Error('error.userNotFound');
      }
      const user_id = userCheck.id;
      const cardCheck = await CardModelInstance.get(card_id);
      if (cardCheck === null) {
        throw new Error('error.cardNotFound');
      }

      const sql = 'DELETE FROM rp_user_to_card_link WHERE user_id = $1 AND card_id = $2 RETURNING *';
      const values = [user_id, card_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userCardNotUnlinked');
      }
      client.release();
      return cardCheck;
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

}

export const UserModelInstance = new UserModel();
export default UserModelInstance;