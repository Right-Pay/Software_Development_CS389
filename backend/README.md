
# ExpressJS Server for RightPay

The backend for the RightPay app

Using NodeJS, ExpressJS, and Postgres


## Run on Server

To run this project, you will need to add the following environment variables to your .env file

backend:\
`PORT`\
`POSTGRES_USER`\
`POSTGRES_PW`\
`POSTGRES_DB`

You can do so by coping the .env.local file, removing the .local extension, and editing the entries

### Start Server

```bash
yarn install
```

Then

```bash
pm2 start dist/server.js --watch --name prod-backend --log ~/logs/prod-errors.log --time
```

### Kill Server

```bash
pm2 list
```

Get id of pm2 instance, use to stop:

```bash
pm2 stop {id}
```

### Reload after changes

Sometimes `--watch` does not work. In this case you must reload manually (replace 1 with the respective pm2 instance id):

```bash
npm --prefix "~/stack/projects/" run build
pm2 restart 1
```

Or

```bash
yarn --cwd "~/stack/projects/" build
pm2 restart 1
```

Or
```bash
~./rebuild-prod
```

## Run Locally

Install dependencies

```bash
yarn install
```

```bash
yarn run dev
```

## Open port 3001 to port 3001 on prod server VIA SSH
**Need to download rightpay.pem from xander**

```bash
ssh -N -L 3001:127.0.0.1:3001 -i ~/.ssh/rightpay.pem bitnami@54.146.229.213
```

## API Reference

All API Calls will need the following headers:

| Header                 | Type     | Description                                |
| :--------------------- | :------- | :----------------------------------------- |
| `authorization`        | `string` | **Required**. User's Auth Token from Auth0 |
| `X-Preferred-Language` | `string` | Langauge to use (en or es)                 |

All responses will be in the following format:
```
{
  message: '',
  success: true | false,
  data: {}
}
```

### User API

#### Get User's Profile

```http
  GET /api/users
```

Returns User's Profile in format specified in [userTypes.ts](./src/types/userTypes.ts)

#### Create User

```http
  POST /api/users
```

| Parameter   | Type     | Description                       |
| :---------- | :------- | :-------------------------------- |
| `username`  | `string` | **Required** Display name of user |
| `email`     | `string` | **Required** Email of user        |
| `phone`     | `string` | Phone number of user, not needed  |


Returns User's Created Profile in format specified in [userTypes.ts](./src/types/userTypes.ts)

#### Update User

```http
  PUT /api/users
```

| Parameter   | Type     | Description                       |
| :---------- | :------- | :-------------------------------- |
| `username`  | `string` | **Required** Display name of user |
| `phone`     | `string` | Phone number of user, not needed  |


Returns User's Updated Profile in format specified in [userTypes.ts](./src/types/userTypes.ts)

#### Link Card

```http
  PUT /api/users/linkCard
```

| Parameter    | Type     | Description                                                    |
| :----------- | :------- | :------------------------------------------------------------- |
| `card_id`    | `number` | **This or new_card Required** Card ID                          |
| `exp_date `  | `date`   | **Required** Expiration date (yy-mm)                           |
| `new_card`   | `Card`   | **Optional if Card ID is used** A new Card to use when linking |

Links a card to a user's profile, returns the linked card 

*If you need to create a new card **and** link it to this user, you can use the new_card object instead which would be a json object with the new card*

#### Delete User

```http
  DELETE /api/users
```

Uses auth token to determine which user to delete (only logged in user can delete themself)

Returns whether the user was deleted or not in the data object (could be success true but the user wasn't deleted)


#### Unlink Card

```http
  DELETE /api/users/unlinkCard
```

| Parameter  | Type     | Description          |
| :--------- | :------- | :------------------- |
| `card_id`  | `number` | **Required** Card ID |

Uses auth token to determine which user to unlink card from (only logged in user can unlink their cards)

Returns whether the card was unlinked or not in the data object (could be success true but the card wasn't unlinked)

### Card API

#### Get Card

```http
  GET /api/cards?card_id|card_bin
```

| Query Parameter | Type     | Description                                                         |
| :-------------- | :------- | :------------------------------------------------------------------ |
| `card_bin`      | `string` | **Either this or card_id required** First six digits of card to get |
| `card_id`       | `number` | Card ID in DB                                                       |

Returns Card in format specified in [cardTypes.ts](./src/types/cardTypes.ts)

#### Create Card

```http
  POST /api/cards
```

| Parameter       | Type     | Description                                                 |
| :-------------- | :------- | :---------------------------------------------------------- |
| `card_bin`      | `number` | **Required** Bank Identification Number (first six digits)  |
| `card_name`     | `string` | **Optional** Name of card, if none given, will generate one |
| `card_brand_id` | `number` | **Required** Brand ID                                       |
| `card_bank_id`  | `number` | **Required** Bank ID                                        |
| `card_type`     | `string` | **Required** Type of card (Credit/Debit)                    |
| `card_level`    | `string` | **Required** Card level (Gold)                              |
| `card_country`  | `string` | **Required** Card Country                                   |

Returns Created Card in format specified in [cardTypes.ts](./src/types/cardTypes.ts)

#### Link Reward

```http
  PUT /api/cards/linkReward
```

| Parameter                 | Type     | Description                                                        |
| :------------------------ | :------- | :----------------------------------------------------------------- |
| `reward_id`               | `number` | **This or new_reward Required** Reward ID                          |
| `new_reward`              | `Reward` | **Optional if Reward ID is used** A new Reward to use when linking |
| `type `                   | `string` | **Required** Reward type (only support Cashback as of 12/6/2023)   |
| `card_id`                 | `number` | **Required** Card ID to link reward to                             |
| `user_to_card_link_id`    | `number` | **Required** ID of user card link in db                            |

Links a reward to a card and a user. It will add new rewards to cards or increment the crowd source score of the card reward link.
As for the user, it will link the card to the user's cards reward table which is seperate from the general card rewards table.
This allows for crowd sourcing. 

*If you need to create a new reward **and** link it to this card, you can use the new_reward object instead which would be a json object with the new reward*
*If you need to create a new category **and** link it to the reward which is being linked to this card, you can use new_category in the new_reward obj*

### Bank API

#### Get Bank

```http
  GET /api/banks?bank_name|bank_id
```

| Query Parameter | Type     | Description                                   |
| :-------------- | :------- | :-------------------------------------------- |
| `bank_name`     | `string` | **Either this or bank_id required** Bank name |
| `bank_id`       | `number` | Bank ID in DB                                 |

Returns Bank in format specified in [bankTypes.ts](./src/types/bankTypes.ts)

#### Get All Banks

```http
  GET /api/banks/all
```

Returns all banks in an array of objects, format specified in [bankTypes.ts](./src/types/bankTypes.ts)

### Brand API

#### Get Brand

```http
  GET /api/brands?brand_name|brand_id
```

| Query Parameter | Type     | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `brand_name`    | `string` | **Either this or brand_id required** Brand name |
| `brand_id`      | `number` | Brand ID in DB                                  |

Returns Brand in format specified in [brandTypes.ts](./src/types/brandTypes.ts)

#### Get All Brands

```http
  GET /api/brands/all
```

Returns all brands in an array of objects, format specified in [brandTypes.ts](./src/types/brandTypes.ts)

### Category API

#### Get Category

```http
  GET /api/categories?category_name|category_id
```

| Query Parameter    | Type     | Description                                           |
| :----------------- | :------- | :---------------------------------------------------- |
| `category_name`    | `string` | **Either this or category_id required** Category name |
| `category_id`      | `number` | Category ID in DB                                     |

Returns Category in format specified in [categoryTypes.ts](./src/types/categoryTypes.ts)

#### Get All Categories

```http
  GET /api/categories/all
```

Returns all categoriess in an array of objects, format specified in [categoryTypes.ts](./src/types/categoryTypes.ts)

#### dotenv.config()

Loads the .env file

