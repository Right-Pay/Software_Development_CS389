
# Software_Development_CS389

Final Project for CS389

Created by Tyler Besnoff, Lucas Lecler, and Xander Hughes (TLX)

## Tech Stack (MERN)

**Client:** React Native

**Server:** Node, Express, MongoDB


## Installation

### Requirements

- NVM
- Node v16
- Android Studio
- Android SDK0
- [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup)
  - Skip creating a new application, that has been done already in the app directory
  - You only have to run ``` npm run start ``` thentype a, you don't have to run ``` npm run android ```

Install the backend:

```bash
  cd backend
  npm i
```

Install the frontend:

```bash
  cd ../app
  npm i
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

backend:\
`PORT`


You can do so by coping the .env.local files, removing the .local extension, and editing the entries
## Run Locally

Clone the project

```bash
  git clone https://github.com/Right-Pay/Software_Development_CS389.git
```

Go to the project directory

```bash
  cd .\Software_Development_CS389\
```

Install dependencies for the backend

```bash
  cd .\backend\
  npm install
```

Start the server (ExpressJS)

```bash
  npm run start
```

Install dependencies for the app

```bash
  cd ../app
  npm install
  npm run start
```

Follow the README in the app directory to install Android Studio and start your emulator.
[React Native - Environment Setup](https://reactnative.dev/docs/environment-setup)

**Restart all terminals after updating path variables**

Start the app (a for android, and i for iOS [iOS only works on macOS])

```bash
  npm run start
```

If we switch to not using expo:


# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

- If you can not launch the android emulator, run this:

```
npx react-native doctor
```

- If there are any issues with the android sdk, edit your config file for the emulator of your choice to use host graphics:
```
C:/Users/<user>/.android/AVD/<your emulator name>.avd/config.init

gpu.mode=host
```

## Authors

- [@Tibesnoff](https://www.github.com/Tibesnoff)
- [@lecler17](https://www.github.com/lecler17)
- [@xhughesey](https://www.github.com/xhughesey)

