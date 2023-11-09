
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

#### Link Card

```http
  PUT /api/users/linkCard
```

| Parameter    | Type     | Description                                                    |
| :----------- | :------- | :------------------------------------------------------------- |
| `card_id`    | `number` | **This or new_card Required** Card ID                          |
| `exp_date `  | `date`   | **Required** Expiration date (yyy-mm-dd)                       |
| `new_card`   | `Card`   | **Optional if Card ID is used** A new Card to use when linking |

Links a card to a user's profile, returns the linked card 

*If you need to create a new card **and** link it to this user, you can use the new_card object instead which would be a json object with the new card, **this is untested***

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
  GET /api/cards
```

| Parameter   | Type     | Description                                                         |
| :---------- | :------- | :------------------------------------------------------------------ |
| `card_bin`  | `string` | **Either this or card_id required** First six digits of card to get |
| `card_id`   | `number` | Card ID in DB                                                       |

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

#### Delete Card

```http
  DELETE /api/card
```

Used to delete a card. No user has access to do this atm


### Bank API

#### Get Bank

```http
  GET /api/banks
```

| Parameter   | Type     | Description                                   |
| :---------- | :------- | :-------------------------------------------- |
| `bank_name` | `string` | **Either this or bank_id required** Bank name |
| `bank_id`   | `number` | Bank ID in DB                                 |

Returns Bank in format specified in [bankTypes.ts](./src/types/bankTypes.ts)

#### Get All Banks

```http
  GET /api/banks/all
```

Returns all banks in an array of objects, format specified in [bankTypes.ts](./src/types/bankTypes.ts)

#### Create Bank

```http
  POST /api/banks
```

| Parameter     | Type     | Description                    |
| :------------ | :------- | :----------------------------- |
| `bank_name`   | `string` | **Required** Bank name         |
| `bank_abbr`   | `string` | **Required** Bank abbreviation |

Returns Created Bank in format specified in [bankTypes.ts](./src/types/bankTypes.ts)

#### Delete Bank

```http
  DELETE /api/banks
```

Used to delete a bank. No user has access to do this atm


### Brand API

#### Get Brand

```http
  GET /api/brands
```

| Parameter    | Type     | Description                                     |
| :----------- | :------- | :---------------------------------------------- |
| `brand_name` | `string` | **Either this or brand_id required** Brand name |
| `brand_id`   | `number` | Brand ID in DB                                  |

Returns Brand in format specified in [brandTypes.ts](./src/types/brandTypes.ts)

#### Get All Brands

```http
  GET /api/brands/all
```

Returns all brands in an array of objects, format specified in [brandTypes.ts](./src/types/brandTypes.ts)

#### Create Brand

```http
  POST /api/brands
```

| Parameter      | Type     | Description             |
| :------------- | :------- | :---------------------- |
| `brand_name`   | `string` | **Required** Brand name |

Returns Created Brand in format specified in [brandTypes.ts](./src/types/brandTypes.ts). Really only used on the admin side

#### Delete Brand

```http
  DELETE /api/brands
```

Used to delete a brand. No user has access to do this atm

#### dotenv.config()

Loads the .env file

