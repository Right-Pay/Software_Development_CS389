
# ExpressJS Server for RightPay

The backend for the RightPay app

Using NodeJS, ExpressJS, and MongoDB



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

backend:\
`PORT`


You can do so by coping the .env.local file, removing the .local extension, and editing the entries
## Run Locally

Install dependencies

```bash
  npm install
```

Start the server (ExpressJS)

```bash
  npm run start
```

## API Reference

#### Get Test

```http
  GET /api/test/${id}
```

| Parameter  | Type     | Description  |
| :--------  | :------- | :----------- |
| `test_key` | `string` | Does nothing |

#### Get Base URL of API

```http
  GET /
```

| Parameter  | Type     | Description  |
| :--------  | :------- | :----------- |
| `test_id`  | `string` | Does nothing |

#### dotenv.config()

Loads the .env file

