// generate a category model that will be used to interact with the database
import { dbPool } from "../config/config";
import i18n from '../config/i18n';
import { Category } from "../types/categoryTypes";

export class CategoryModel {

  async create(category: Category): Promise<Category> {
    try {
      const client = await dbPool.connect();
      const categoryCheck = await this.getByName(category.category_name);
      if (categoryCheck && categoryCheck.specific_places === category.specific_places) {
        throw new Error('error.categoryFound');
      }
      if (category.specific_places instanceof String) {
        const categoryString = category.specific_places.replace(/\s/g, '');
        category.specific_places = categoryString.split(',');
      }
      const sql = 'INSERT INTO rp_categories (category_name, specific_places) VALUES ($1, $2) RETURNING *';
      const values = [category.category_name, category.specific_places];
      const result = await client.query(sql, values);
      if (!result.rows.length) {
        throw new Error('error.categoryNotCreated');
      }
      client.release();
      return result.rows[0];
    } catch (err: any) {
      console.log('DB Error', err);
      const categoryFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(categoryFriendlyError);
    }
  }

  async get(category_id: number): Promise<Category | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_categories WHERE id = $1';
      const values = [category_id];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const categoryFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(categoryFriendlyError);
    }
  }

  async getByName(category: string): Promise<Category | null> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_categories WHERE category_name = $1';
      const values = [category];
      const result = await client.query(sql, values);
      client.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err: any) {
      console.log('DB Error', err);
      const categoryFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(categoryFriendlyError);
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      const client = await dbPool.connect();
      const sql = 'SELECT * FROM rp_categories';
      const result = await client.query(sql);
      client.release();
      return result.rows;
    } catch (err: any) {
      console.log('DB Error', err);
      const categoryFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(categoryFriendlyError);
    }
  }

  async delete(category_id: number): Promise<boolean> {
    try {
      const categoryCheck = await this.get(category_id);
      if (categoryCheck === null) {
        throw new Error('error.categoryNotFound');
      }

      const sql = 'DELETE FROM rp_categories WHERE id = $1 RETURNING *';
      const values = [category_id];
      const result = await dbPool.query(sql, values);

      return result.rows.length > 0;
    } catch (err: any) {
      console.log('DB Error', err);
      const categoryFriendlyError = i18n.t([err.message, 'error.default']);
      throw new Error(categoryFriendlyError);
    }
  }

}

export const CategoryModelInstance = new CategoryModel();
export default CategoryModelInstance;