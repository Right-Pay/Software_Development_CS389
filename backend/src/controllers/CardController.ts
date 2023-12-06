import axios from 'axios';
import { Request, Response } from 'express';
import i18n from '../config/i18n';
import BankModelInstance from '../models/BankModel';
import BrandModelInstance from '../models/BrandModel';
import CardModel, { CardModelInstance } from '../models/CardModel';
import CategoryModelInstance from '../models/CategoryModel';
import RewardModelInstance from '../models/RewardModel';
import UserModelInstance from '../models/UserModel';
import { Card } from '../types/cardTypes';
import { Category } from '../types/categoryTypes';
import { IJsonResponse } from '../types/jsonResponse';
import { Reward } from '../types/rewardTypes';

class CardController {
  async getCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    if (req.query.hasOwnProperty('card_id') && Number.isNaN(Number(req.query.card_id))) {
      response.success = false;
      response.message = i18n.t('error.cardNotFound');
      res.status(400).json(response);
      return;
    } else if (req.query.hasOwnProperty('card_bin') && Number.isNaN(Number(req.query.card_bin))) {
      response.success = false;
      response.message = i18n.t('error.cardNotFound');
      res.status(400).json(response);
      return;
    }
    const cardId: number = Number(req.query.card_id || 0);
    const cardBin: number = Number(req.query.card_bin || 0);
    if (!cardId && !cardBin) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      let card;
      if (cardId) {
        card = await CardModel.get(cardId);
      } else {
        card = await CardModel.getByBin(cardBin);
      }
      if (card) {
        response.data = card;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.cardNotFound');
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

  async getCardFromAPI(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    if ((req.query.hasOwnProperty('card_bin') && (Number.isNaN(Number(req.query.card_bin)) || Number(req.query.card_bin) < 100000)) || !req.query.card_bin) {
      response.success = false;
      response.message = i18n.t('error.cardNotFound');
      res.status(400).json(response);
      return;
    }
    const cardBin: number = Number(req.query.card_bin || 0);
    if (!cardBin) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const card = await this.getCardFromAPIFnc(cardBin);
      if (card) {
        response.data = card;
        res.json(response);
      } else {
        response.success = false;
        response.message = i18n.t('error.cardNotFound');
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

  async getCardFromAPIFnc(cardBin: number): Promise<boolean|Card> {
    const response = await axios({
      method: 'POST',
      url: `https://bin-ip-checker.p.rapidapi.com/?bin=${cardBin}`,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '4b6b6e6ef2msh2e79065a169063ap1bed05jsn912041adaff8',
        'X-RapidAPI-Host': 'bin-ip-checker.p.rapidapi.com'
      },
      data: {bin: cardBin}
    });

    try {
      CardModelInstance.updateApiCount('rapidapi');
    } catch (error) {
      console.log(error);
      console.log('Failed to update API count for rapidapi');
    }

    if (response.status !== 200) {
      return false;
    }

    const responseJson = await response.data;
    if (responseJson.success = false || !responseJson || !responseJson.BIN) {
      return false;
    }

    const binData = responseJson.BIN;
    if (binData.valid === false) {
      return false;
    }

    const cardData: Card = {
      card_bin: cardBin,
      card_bank_id: 0,
      card_brand_id: 0,
      card_country: binData?.country?.alpha3 || 'USA',
      card_level: '',
      card_name: '',
      card_type: binData?.card_type || '',
    };

    if (binData.issuer && binData.issuer.name) {
      const bankName = binData.issuer.name;
      const bank = await BankModelInstance.getByName(bankName);
      if (!bank) {
        const newBank = await BankModelInstance.create({ bank_name: bankName, abbr: bankName });
        cardData.card_bank_id = newBank.id || 0;
        cardData.card_bank_name = newBank.bank_name;
        cardData.card_bank_abbr = newBank.abbr;
      } else {
        cardData.card_bank_id = bank.id || 0;
        cardData.card_bank_name = bank.bank_name;
        cardData.card_bank_abbr = bank.abbr;
      }
    }

    if (binData.brand) {
      const brandName = binData.brand;
      const brand = await BrandModelInstance.getByName(brandName);
      const brandAbbr = brandName.toLowerCase().replace(' ', '_');
      if (!brand) {
        const newBrand = await BrandModelInstance.create({ brand_name: brandName, brand_abbr: brandAbbr });
        cardData.card_brand_id = newBrand.id || 0;
        cardData.card_brand_name = newBrand.brand_name;
      } else {
        cardData.card_brand_id = brand.id || 0;
        cardData.card_brand_name = brand.brand_name;
      }
    }
    return cardData;
  }

  async createCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Register Card',
      success: true,
      data: {}
    };
    const cardData = req.body as Card;
    if (!cardData.card_bin || !cardData.card_bank_id || !cardData.card_brand_id || !cardData.card_type || !cardData.card_level) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      res.status(400).json(response);
      return;
    }
    try {
      const bank = await BankModelInstance.get(cardData.card_bank_id);
      const brand = await BrandModelInstance.get(cardData.card_brand_id);
      if (!bank) {
        throw new Error(i18n.t('error.bankNotFound'));
      }
      if (!brand) {
        throw new Error(i18n.t('error.brandNotFound'));
      }
      if (!cardData.card_name) {
        cardData.card_name = bank.bank_name + ' ' +
          cardData.card_level;
      }
      const newCard = await CardModel.create(cardData);
      response.data = newCard;
      res.status(201).json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      response.data = {};
      res.status(500).json(response);
    }
    return response;
  }

  async linkRewardToCard(req: Request, res: Response) {
    const response: IJsonResponse = {
      message: 'TLX API - Link Reward to Card',
      success: true,
      data: {}
    };
    const cardId = req.body.card_id;
    const userToCardLinkId = req.body.user_to_card_link_id;
    const authId = req.auth?.payload.sub || '';
    const userCheck = await UserModelInstance.get(authId);
    if (userCheck === null) {
      throw new Error('error.userNotFound');
    }
    const userId = userCheck.id;
    let rewardId = req.body.reward_id;
    let newReward = req.body.new_reward;
    const type = req.body.type;
    if (!cardId || (!rewardId && !newReward) || !type || !userToCardLinkId) {
      response.success = false;
      response.message = i18n.t('error.missingFields');
      response.data = {
        card_id: cardId || 'missing',
        reward_id: rewardId || 'missing',
        new_reward: newReward || 'missing (optional)',
        type: type || 'missing',
        user_to_card_link_id: userToCardLinkId || 'missing',
      }
      res.status(400).json(response);
      return;
    }
    try {
      // verification 
      const card = await CardModel.get(cardId);
      if (!card) {
        throw new Error(i18n.t('error.cardNotFound'));
      }
      let crowdSourceScore = 0;
      let returnReward;
      if (rewardId) {
        // verification
        const reward = await RewardModelInstance.get(rewardId);
        console.log('reward', reward);
        if (!reward) {
          throw new Error(i18n.t('error.rewardNotFound'));
        }

        // if reward is linked to this card, get the crowd_source_score
        const cardRewards = await RewardModelInstance.getByCard(cardId);
        console.log('cardRewards', cardRewards);
        if (cardRewards.length > 0) {
          const matchingReward = cardRewards.find((cardReward) => Number(cardReward.id) === Number(rewardId));
          if (matchingReward) {
            console.log('matchingReward', matchingReward);
            crowdSourceScore = matchingReward.crowd_source_score || 0;
          }
        }
        returnReward = reward;
      } else {
        // create a new reward
        let categoryId = newReward.category_id;
        const newCategory: Category = newReward.new_category;
        // verification
        if (!categoryId && !newCategory) {
          throw new Error(i18n.t('error.missingFields'));
        }

        if (categoryId) {
          // verification
          const category = await CategoryModelInstance.get(newReward.category_id);
          if (!category) {
            throw new Error(i18n.t('error.categoryNotFound'));
          }
        } else {
          // create new category
          const categoryData: Category = {
            category_name: newCategory.category_name,
            specific_places: newCategory.specific_places,
          };
          const categoryCheck = await CategoryModelInstance.getByName(categoryData.category_name);
          if (categoryCheck && categoryCheck.specific_places === categoryData.specific_places) {
            categoryId = categoryCheck.id || -1;
          } else {
            const category = await CategoryModelInstance.create(categoryData);
            categoryId = category.id || -1;
            if (!category) {
              throw new Error(i18n.t('error.categoryNotFound'));
            }
          }
        }

        // create rewardDataObject
        const rewardData: Reward = {
          category_id: categoryId,
          initial_percentage: newReward.initial_percentage,
          initial_limit: newReward.initial_limit,
          term_length_months: newReward.term_length_months,
          fallback_percentage: newReward.fallback_percentage,
          type: type,
        };

        // check to see if reward already exists
        const rewardCheck = await RewardModelInstance.getByAllFields(rewardData);
        if (rewardCheck) {
          // if it does, use that reward id and check to see if it's linked to this card, if it is get the crowd_source_score
          rewardId = rewardCheck.id || -1;
          const cardRewards = await RewardModelInstance.getByCard(cardId);
          if (cardRewards.length > 0) {
            const matchingReward = cardRewards.find((cardReward) => cardReward.id === rewardId);
            if (matchingReward) {
              crowdSourceScore = matchingReward.crowd_source_score || 0;
            }
          }
          returnReward = rewardCheck;
        } else {
          // if it doesn't, create a new reward and link it to this card
          const reward = await RewardModelInstance.create(rewardData);
          rewardId = reward.id || -1;
          returnReward = reward;
        }
      }
      
      let linkedReward;
      let linkedUserReward;
      
      const user_card_reward_link = await RewardModelInstance.getByUserCard(userId, cardId);
      if (user_card_reward_link.length > 0) {
        const thisRewardLink = user_card_reward_link.find((link) => link.id === rewardId);
        if (thisRewardLink) {
          response.data.code = 'reward_already_linked';
          throw new Error(i18n.t('error.rewardAlreadyLinked'));
        }
      }
      if (crowdSourceScore > 0) {
        // increment crowd_source_score by 1
        linkedReward = await RewardModelInstance.incrementCrowdSourceScore(cardId, rewardId);
        // if crowd source score is below 3, add reward to user card reward link table
        linkedUserReward = await CardModel.linkUserReward(userId, cardId, userToCardLinkId, linkedReward.id || 0);
      } else {
        // create new link to reward in both user_card_reward and card_reward
        linkedReward = await CardModel.linkReward(cardId, rewardId, type);
        linkedUserReward = await CardModel.linkUserReward(userId, cardId, userToCardLinkId, linkedReward.id || 0);
      }
      returnReward.crowd_source_score = linkedReward.crowd_source_score;
      returnReward.card_to_reward_link_id = linkedReward.card_to_reward_link_id;
      if (!returnReward.category) {
        const returnCategory = await CategoryModelInstance.get(returnReward.category_id);
        if (returnCategory) {
          returnReward.category = returnCategory;
        }
      }
      response['data'] = returnReward;
      res.json(response);
    } catch (error: any) {
      response.success = false;
      response.message = error.message;
      res.status(500).json(response);
    }
    return response;
  }

  async unlinkRewardFromCard(req: Request, res: Response) {
    // go through normal verification
    // if reward is linked to this card, get the crowd_source_score
    // decrement crowd source, if crowd source gets decremented to 0, remove hte reward from the card
    // remove the reward from the user card reward link table
  }

  // async deleteCard(req: Request, res: Response) {
  //   const response: IJsonResponse = {
  //     message: 'TLX API - Delete Card',
  //     success: true,
  //     data: {}
  //   };
  //   const cardId = req.body.card_id;
  //   try {
  //     throw new Error(i18n.t('error.notAllowedAtThisTime'));
  //   } catch (error: any) {
  //     response.success = false;
  //     response.message = error.message;
  //     response.data = {};
  //     res.status(500).json(response);
  //   }
  // }

  // async addCardsFromCSV(req: Request, res: Response) {
  //   const response: IJsonResponse = {
  //     message: 'TLX API - Register Card',
  //     success: true,
  //     data: {}
  //   };
  //   const banks = await BankModelInstance.getAll();
  //   const brands = await BrandModelInstance.getAll();
  //   const csvFilePath = path.join(__dirname, '../../src/binlist-data.csv');
  //   // 0.bin,1.brand,2.type,3.category,4.issuer(bank),5.alpha_2,6.alpha_3,7.country,8.latitude,9.longitude,10.bank_phone,11.bank_url
  //   try {
  //     const fileStream = fs.createReadStream(csvFilePath, 'utf-8');
  //     const rl = readline.createInterface({
  //         input: fileStream,
  //         crlfDelay: Infinity,
  //     });
  
  //     const cardData = [] as Card[];
  //     let isFirstLine = true;
  //     for await (const line of rl) {
  //       if (isFirstLine) {
  //         isFirstLine = false;
  //         continue; // Skip the first line
  //       }

  //       const cardArray = line.split(',');

  //       const brand_name = cardArray[1];
  //       let brand_id = brands.find((brand) => brand.brand_name === brand_name)?.id || -1;
  //       if (brand_id === -1) {
  //         const new_brand = await BrandModelInstance.create({ brand_name });
  //         brand_id = new_brand.id || -1;
  //         brands.push(new_brand);
  //       }
  //       const bank_name = cardArray[4];
  //       let bank_id = banks.find((bank) => bank.bank_name === bank_name)?.id || -1;
  //       if (bank_id === -1) {
  //         const new_bank = await BankModelInstance.create({ bank_name, abbr: bank_name });
  //         bank_id = new_bank.id || -1;
  //         banks.push(new_bank);
  //       }

  //       const cardObject: Card = {
  //         card_bin: parseInt(cardArray[0]),
  //         card_brand_id: brand_id,
  //         card_type: cardArray[2],
  //         card_bank_id: bank_id,
  //         card_country: cardArray[7],
  //         card_level: cardArray[3] ? cardArray[3] : '',
  //         card_name: bank_name + ' ' + brand_name + ' ' + cardArray[3] + ' ' + cardArray[2],
  //       };

  //       const newCard = await CardModel.create(cardObject);
  //       cardData.push(newCard);
  //     };
  //     response.data = cardData;
  //     res.status(201).json(response);
  //   } catch (error: any) {
  //     response.success = false;
  //     response.message = error.message + ' - failed at cardData.map';
  //     response.data = {};
  //     res.status(500).json(response);
  //   }
  // }

}

export default new CardController();
