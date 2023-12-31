import { Request, Response } from 'express';
import i18n from '../config/i18n';
import BrandModel from '../models/BrandModel';
import { Brand } from '../types/brandTypes';
import { IJsonResponse } from '../types/jsonResponse';

class BrandController {
  async getBrand(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get Brand',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('brand_id') && Number.isNaN(Number(req.query.brand_id))) {
      response.success = false;
      response.message = i18n.t('error.brandNotFound');
      res.status(400).json(response);
      return;
    }
    const brandId: number = Number(req.query.brand_id || 0);
    const brandName: string = String(req.query.brand_name || '');
    if (!brandId && !brandName) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      let brand;
      if (brandId) {
        brand = await BrandModel.get(brandId);
      } else {
        brand = await BrandModel.getByName(brandName);
      }
      if (brand) {
        response.data = brand;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.brandNotFound');
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

  async getAllBrands(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Get All Brands',
      success: true,
      data: {}
    };
    try {
      const brands = await BrandModel.getAll();
      if (brands) {
        response.data = brands;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.brandNotFound');
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

  async createBrand(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Brand',
      success: true,
      data: {}
    };
    const brandData = req.body as Brand;
    if (!brandData.brand_name || !brandData.brand_abbr) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      throw new Error(i18n.t('error.notAllowedAtThisTime'));
      // const newBrand = await BrandModel.create(brandData);
      // response.data = newBrand;
      // res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async deleteBrand(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Delete Brand',
      success: true,
      data: {}
    };
    if (!req.auth?.payload.sub) {
      response.success = false;
      response.message = i18n.t('error.unauthorized');
      res.status(401).json(response);
      return;
    }
    const brandId = req.body.brand_id;
    if (!brandId) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      throw new Error(i18n.t('error.notAllowedAtThisTime'));
      // const brandDeleted = await BrandModel.delete(brandId);
      // if (brandDeleted) {
      //   response.data = brandDeleted;
      //   res.json(response);
      // }
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
  }
}

export default new BrandController();
