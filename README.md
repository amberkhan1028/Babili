## Description

Babili is an app aimed at ESL adults and children who wish to improve their conversational English skills in a fun way.

Upon signing in, the user is taken to a chat page where they can practice conversing in English with Devi, a friendly AI bot created using Google's Dialogflow. Through Devi users may add English words to their 'word bank.'

Users may also add words to their word bank via the flashcard game. All games are accessible from the games icon. Along with flashcards, the user can play a picture/word matching game which utilizes the words they have added into their word bank.

Babili also contains an object detection feature. This tool utilizes machine learning and the phone's camera to determine what an object is. After detection, the English and Spanish word are relayed back to the user.

## Dependencies

"dependencies": {
    "@expo/vector-icons": "^12.0.2",
    "@google-cloud/dialogflow": "^3.3.0",
    "@material-ui/core": "^4.11.2",
    "@material-ui/icons": "^4.11.2",
    "@material-ui/lab": "^4.0.0-alpha.57",
    "@react-native-community/async-storage": "^1.12.1",
    "@react-native-community/masked-view": "0.1.10",
    "@react-native-community/netinfo": "5.9.7",
    "@react-navigation/native": "^5.8.10",
    "@react-navigation/stack": "^5.12.8",
    "@tensorflow-models/mobilenet": "^2.0.4",
    "@tensorflow/tfjs": "^2.7.0",
    "@tensorflow/tfjs-react-native": "^0.5.0",
    "aws-amplify": "^3.3.13",
    "aws-amplify-react-native": "^4.2.10",
    "axios": "^0.21.0",
    "babel-plugin-inline-dotenv": "^1.6.0",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "expo": "^40.0.0",
    "expo-av": "^8.7.0",
    "expo-camera": "~9.1.0",
    "expo-constants": "^9.3.5",
    "expo-document-picker": "~8.4.1",
    "expo-facebook": "~9.1.0",
    "expo-file-system": "^9.3.0",
    "expo-gl": "^9.2.0",
    "expo-google-app-auth": "^8.1.4",
    "expo-image-picker": "~9.2.0",
    "expo-permissions": "~10.0.0",
    "expo-speech": "~8.5.0",
    "expo-status-bar": "~1.0.3",
    "express": "^4.17.1",
    "fs": "0.0.1-security",
    "jpeg-js": "^0.4.2",
    "metro-react-native-babel-preset": "^0.64.0",
    "native-base": "^2.15.0",
    "path": "^0.12.7",
    "pg": "^8.5.1",
    "pg-hstore": "^2.3.3",
    "pg-promise": "^10.8.6",
    "prop-types": "^15.7.2",
    "pusher": "^4.0.2",
    "pusher-js": "^7.0.2",
    "random-words": "^1.1.1",
    "react": "^16.14.0",
    "react-dom": "16.13.1",
    "react-hook-form": "^6.13.1",
    "react-native": "https://github.com/expo/react-native/archive/sdk-40.0.0.tar.gz",
    "react-native-camera": "git+https://git@github.com/react-native-community/react-native-camera.git",
    "react-native-cli": "^2.0.1",
    "react-native-config": "^1.4.1",
    "react-native-dialogflow-text": "0.0.1",
    "react-native-dotenv": "^2.4.3",
    "react-native-elements": "^3.0.1",
    "react-native-fbsdk": "^3.0.0",
    "react-native-flip-card": "^3.5.6",
    "react-native-fs": "^2.16.6",
    "react-native-gesture-handler": "~1.8.0",
    "react-native-gifted-chat": "^0.16.3",
    "react-native-modal": "^11.6.1",
    "react-native-paper": "^4.5.0",
    "react-native-picker-select": "^8.0.4",
    "react-native-reanimated": "~1.13.0",
    "react-native-safe-area-context": "3.1.9",
    "react-native-screens": "~2.15.0",
    "react-native-search-bar": "^3.5.1",
    "react-native-shapes": "^0.1.0",
    "react-native-vector-icons": "^7.1.0",
    "react-native-web": "~0.13.12",
    "react-navigation": "^4.4.3",
    "react-navigation-stack": "^2.10.2",
    "react-navigation-tabs": "^2.10.1",
    "regenerator-runtime": "^0.13.7",
    "sequelize": "^6.3.5",
    "stream-chat": "^2.10.0",
    "stream-chat-expo": "^2.1.1",
    "watchman": "^1.0.0"
  },
  "devDependencies": {
    "@babel/core": "~7.9.0",
    "eslint": "^7.14.0",
    "eslint-config-airbnb": "^18.2.1",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-react": "^7.21.5",
    "eslint-plugin-react-hooks": "^4.2.0",
    "husky": "^4.3.0",
    "lint-staged": "^10.5.2"
  },

  ## Installation and Startup

  1. Fork the **CSL-CodingAsASecondLanguage/Babili** repo
  2. Clone your **forked repo** into your file system
  3. Run **npm install** to install dependencies
    `npm install`
  4. Create a **.env** file in your main director and install the dotenv package
    `npm install dotenv`
  The .env file will house all of your keys and other sensitive information

| Variable                    | Description                 |
| ----------------------------| --------------------------- |
| PUSHER_APP_ID               |                             |
| PUSHER_KEY                  |                             |
| PUSHER_SECRET               |                             |
| PUSHER_CLUSTER              |                             |
| GOOGLE_IOS                  |                             |
| GOOGLE_AND                  |                             |
| DB_NAME                     |                             |
| DB_USER                     |                             |
| DB_PASSWORD                 |                             |
| DIALOG_FLOW_CLIENT_EMAIL    |                             |
| DIALOG_FLOW_PRIVATE_KEY     |                             |
| DIALOG_FLOW_PROJECT_ID      |                             |
| CONNECTION_STRING           |                             |
| BASE_URL                    |                             |
| OCR                         |                             |

  5. Install **expo** and **expo-cli**
    `npm install -g expo expo-cli`
  6. Start up the mobile emulator by typing **expo start** in your terminal
    `expo start`

## Database
The Babili database is powered by PostgreSQL and hosted on ElephantSQL. In order to initiate the connection to the database run npm start in your terminal. If the connection is successful, you'll see the following message in your terminal: db connected.

In order to access the all the database you need to have PostgreSQL installed. You can follow the following tutorial provided by the PostgreSQL team here: https://www.postgresql.org/download/

You can also access the database from the ElephantSQL online portal. To do so, go to https://www.elephantsql.com/ in your browser and login. If you are an authorized user of the Babili database, you'll see the database instance upon login. Click into the instance and select 'Browser' on the left-side menu. Once in the Browser portal, you'll be able to query the database as desired using PSQL commands.

## API's

# Google OAUTH

# Pusher
Live chat between users and notifications are powered by Pusher. In order to enable functionality of both features, create a Pusher.json file in your directory. Next, go to https://pusher.com/ and create a appID, key, secret, and cluster. Add these values to your Pusher.json file as an object with matching key/val pairs. Also, create a key in your object of "encrypted" and set to true in order to protect your data.
# DialogFlow

## Deployment
Babili was deployed using Expo. To deploy the app run the following command in your terminal: expo publish.

You'll be prompted with a request to make an account with Expo. Once your account is created your app will be deployed and available for Android users.