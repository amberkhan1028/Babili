/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// eslint-disable-next-line camelcase
import firebase from 'firebase';
import { Dialogflow_V2 } from 'react-native-dialogflow-text';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import config from '../../../config';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState();

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
    setCurrentUser(firebase.auth().currentUser);
    console.warn(currentUser);
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
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS,
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') { // see if the user has already granted permission
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') { return; } // return if they don't grant permission
    try {
      // token that uniquely identifies this device
      const token = await Notifications.getExpoPushTokenAsync();
      firebase.database().ref(`users/${currentUser.uid}/push_token`).set(token);
    } catch (error) {
      console.warn(error);
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
