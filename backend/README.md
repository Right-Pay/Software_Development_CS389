
# ExpressJS Server for RightPay

The backend for the RightPay app

Using NodeJS, ExpressJS, and MongoDB


## For server use only, not local

To run this project, you will need to add the following environment variables to your .env file

backend:\
`PORT`

You can do so by coping the .env.local file, removing the .local extension, and editing the entries

Run the following commands to start on server:

```bash
  yarn install
```

and then

```bash
  [forever start ~/forever/development.json](https://classes.pace.edu/d2l/lms/dropbox/user/folder_submit_files.d2l?db=221645&grpid=390223&isprv=0&bp=0&ou=379797)
```

to stop the process:

```bash
  forever stop 0
```

## Run Locally

Install dependencies

```bash
  yarn install
```

Start your connection to the server

**Need to download rightpay.pem from xander**

```bash
  ssh -N -L 3001:127.0.0.1:3001 -i C:\Users\{username}\.ssh\rightpay.pem bitnami@54.146.229.213
```

## API Reference

#### Get Test

```http
  GET /api/test/${test_key}
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

