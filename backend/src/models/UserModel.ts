// generate a user model that will be used to interact with the database
import { dbPool } from "../config/config";
import { User } from "../types/userTypes";
import i18n from '../config/i18n';
import { Card, Reward } from "../types/cardTypes";
import CardModelInstance from "./CardModel";
import { Bank } from "../types/bankTypes";
import BankModelInstance from "./BankModel";
import { Brand } from "../types/brandTypes";
import BrandModelInstance from "./BrandModel";

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
            const bank = banks.find((bank: Bank) => bank.id === card.card_bank_id);
            if (bank) {
              card.card_bank = bank;
            }
            const brand = brands.find((brand: Brand) => brand.id === card.card_brand_id);
            if (brand) {
              card.card_brand = brand;
            }
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

  async link_user_to_card(auth_id: string, card_id: number): Promise<Card> {
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

      const sql = 'INSERT INTO rp_users_to_card_link (user_id, card_id) VALUES ($1, $2) RETURNING *';
      const values = [user_id, card_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userCardNotLinked');
      }
      client.release();
      return cardCheck;
    } catch (err: any) {
      console.log('DB Error', err);
      const userFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(userFriendlyError);
    }
  }

  async unlink_user_from_card(auth_id: string, card_id: number): Promise<Card> {
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

      const sql = 'INSERT INTO rp_users_to_card_link (user_id, card_id) VALUES ($1, $2) RETURNING *';
      const values = [user_id, card_id];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.userCardNotLinked');
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