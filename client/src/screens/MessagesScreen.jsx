/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Platform } from 'react-native';
import { Dialogflow_V2 } from 'react-native-dialogflow-text';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import firebase from 'firebase';
import config from '../../../config';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);

  const BOT_USER = {
    _id: 2,
    name: 'Devi',
    avatar: 'https://cdn2.vectorstock.com/i/1000x1000/84/56/chatbot-cute-female-robot-in-chat-bubble-icon-vector-23798456.jpg',
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      config.DIALOG_FLOW_CLIENT_EMAIL,
      config.DIALOG_FLOW_PRIVATE_KEY,
      Dialogflow_V2.LANG_ENGLISH_US,
      config.DIALOG_FLOW_PROJECT_ID,
    );
    registerForPushNotificationsAsync();
  });

  useEffect(() => {
    setMessages([
      {
        _id: Math.round(Math.random() * 1000000),
        text: "Hi I'm Devi! I'm here to help you learn how to converse in English. What would you like to talk about today?",
        createdAt: new Date(),
        user: BOT_USER,
      },
    ]);
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        // ask for permission
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
        // if they deny permission
        if (finalStatus !== 'granted') {
          console.warn('Failed to get push token for push notification!');
          return;
        } // if they give permission
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.warn(token);
        const currentUser = await firebase.auth().currentUser;
        firebase
          .database()
          .ref(`users/${currentUser.uid}/push_token`)
          .set(token);
      } else { // they've already given permission previously
        console.warn('User has already given permission');
      }
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      const currentUser = await firebase.auth().currentUser;
      firebase
        .database()
        .ref(`users/${currentUser.uid}/push_token`)
        .set(token);
    } else {
      console.warn('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

    }
  };

  const sendBotResponse = (text) => {
    const msg = {
      _id: Math.round(Math.random() * 1000000),
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [msg]));
  };

  const handleGoogleResponse = (result) => {
    const text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

    const message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleResponse(result),
      (error) => console.warn(error),
    );
  }, []);

  const renderBubble = (props) => (
    <Bubble
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0f9535',
        },
      }}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
    />
  );
}
