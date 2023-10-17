// generate a user model that will be used to interact with the database
import { dbPool } from "../config/config";
import { User, UserCreate } from "../types/userTypes";
import i18n from '../config/i18n';

export class UserModel {

  async create(user: UserCreate): Promise<User> {
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
      const sql = 'SELECT * FROM rp_users WHERE auth_id = $1';
      const values = [auth_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
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

}

export const UserModelInstance = new UserModel();
export default UserModelInstance;