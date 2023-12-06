// generate a brand model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Brand } from "../types/brandTypes";

export class BrandModel {

  async create(brand: Brand): Promise<Brand> {
    try {
      const client = await dbPool.connect();
      const brandCheck = await this.getByName(brand.brand_name);
      if (brandCheck) {
        throw new Error('error.brandFound');
      }
      const sql = 'INSERT INTO rp_brands (brand_name, brand_abbr) VALUES ($1, $2) RETURNING *';
      const values = [brand.brand_name, brand.brand_abbr];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.brandNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const brandFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(brandFriendlyError);
    }
  }

  async get(brand_id: number): Promise<Brand | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_brands WHERE id = $1';
      const values = [brand_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const brandFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(brandFriendlyError);
    }
  }

  async getByName(brand_name: string): Promise<Brand | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_brands WHERE LOWER(brand_name) = LOWER($1)';
      const values = [brand_name];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const brandFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(brandFriendlyError);
    }
  }

  async getAll(): Promise<Brand[]> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_brands';
      const result = await client.query(sql);
      client.release();
      return result.rows;
    } catch (err: any) {
      console.log('DB Error', err);
      const brandFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(brandFriendlyError);
    }
  }

  async delete(brand_id: number): Promise<boolean> {
    try {
      const brandCheck = await this.get(brand_id);
      if (brandCheck === null) {
        throw new Error('error.brandNotFound');
      }

      const sql = 'DELETE FROM rp_brands WHERE id = $1 RETURNING *';
      const values = [brand_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const brandFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(brandFriendlyError);
    }
  }

}

export const BrandModelInstance = new BrandModel();
export default BrandModelInstance;