import { Request, Response } from 'express';
import i18n from '../config/i18n';
import CategoryModel from '../models/CategoryModel';
import { Category } from '../types/categoryTypes';
import { IJsonResponse } from '../types/jsonResponse';

class CategoryController {
  async getCategory(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get Category',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('category_id') && Number.isNaN(Number(req.query.category_id))) {
      response.success = false;
      response.message = i18n.t('error.categoryNotFound');
      res.status(400).json(response);
      return;
    }
    const categoryId: number = Number(req.query.category_id || 0);
    const categoryName: string = String(req.query.category_name || '');
    if (!categoryId && !categoryName) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      let category;
      if (categoryId) {
        category = await CategoryModel.get(categoryId);
      } else {
        category = await CategoryModel.getByName(categoryName);
      }
      if (category) {
        response.data = category;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.categoryNotFound');
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

  async getAllCategories(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get All Categorys',
      success: true,
      data: {}
    };
    try {
      const categorys = await CategoryModel.getAll();
      if (categorys) {
        response.data = categorys;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.categoryNotFound');
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

  async createCategory(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Category',
      success: true,
      data: {}
    };
    const categoryData = req.body as Category;
    if (!categoryData.category_name) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      throw new Error(i18n.t('error.notAllowedAtThisTime'));
      // const newCategory = await CategoryModel.create(categoryData);
      // response.data = newCategory;
      // res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  // async deleteCategory(req: Request, res: Response) {
  //   const response: IJsonResponse = {
  //     message: 'TLX API - Delete Category',
  //     success: true,
  //     data: {}
  //   };
  //   if (!req.auth?.payload.sub) {
  //     response.success = false;
  //     response.message = i18n.t('error.unauthorized');
  //     res.status(401).json(response);
  //     return;
  //   }
  //   const categoryId = req.body.category_id;
  //   if (!categoryId) {
  //     response.success = false;
  //     response.message = i18n.t('error.missingFields');
  //     res.status(400).json(response);
  //     return;
  //   }
  //   try {
  //     throw new Error(i18n.t('error.notAllowedAtThisTime'));
  //     // const categoryDeleted = await CategoryModel.delete(categoryId);
  //     // if (categoryDeleted) {
  //     //   response.data = categoryDeleted;
  //     //   res.json(response);
  //     // }
  //   } catch (error: any) {
  //     response.success = false;
  //     response.message = error.message;
  //     response.data = {};
  //     res.status(500).json(response);
  //   }
  // }
}

export default new CategoryController();
