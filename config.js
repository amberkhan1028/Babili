/* eslint-disable import/no-unresolved */
import {
  GOOGLE_IOS,
  GOOGLE_AND,
  FB_ID,
  OCR,
  DIALOG_FLOW_PRIVATE_KEY,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS,
  BASE_URL,
  FB_SECRET,

} from '@env';

const firebaseConfig = {
  apiKey: 'AIzaSyB6AZFdIcFD9sFJxddUt-eUw1aHIaXVNf4',
  authDomain: 'babili-299117.firebaseapp.com',
  databaseURL: 'https://babili-299117-default-rtdb.firebaseio.com',
  projectId: 'babili-299117',
  storageBucket: 'babili-299117.appspot.com',
  messagingSenderId: '932033800797',
  appId: '1:932033800797:web:8448333d6098b48fdf7bb4',
  measurementId: 'G-8KFB07WSNL',
};
export default {
  GOOGLE_IOS,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
  BASE_URL,
  GOOGLE_AND,
  firebaseConfig,
  DIALOG_FLOW_PROJECT_ID,
  FB_SECRET,
  OCR,
  FB_ID,
  GOOGLE_APPLICATION_CREDENTIALS,
};
