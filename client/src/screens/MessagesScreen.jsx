/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
// eslint-disable-next-line camelcase
import { Dialogflow_V2 } from 'react-native-dialogflow-text';
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

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: 'Aiesha',
        avatar: 'https://www.kindpng.com/picc/m/163-1636340_user-avatar-icon-avatar-transparent-user-icon-png.png',
      }}
    />
  );
}
